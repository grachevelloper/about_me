import {Injectable, Logger, OnApplicationBootstrap} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import bcrypt from "bcrypt";
import {Repository} from "typeorm";

import {Role} from "../../types";
import {
    PUBLIC_TODO_OWNER_EMAIL,
    PUBLIC_TODO_OWNER_USERNAME,
} from "../todos/constants";
import {User} from "./users.entity";

@Injectable()
export class AdminSeedService implements OnApplicationBootstrap {
    private readonly logger = new Logger(AdminSeedService.name);

    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    ) {}

    async onApplicationBootstrap(): Promise<void> {
        await this.ensureAdminUser();
    }

    private async ensureAdminUser(): Promise<void> {
        const password = process.env.GRACHEVELOPERS_PASSWORD;

        if (!password) {
            this.logger.warn(
                "GRACHEVELOPERS_PASSWORD is not set; admin seed skipped",
            );
            return;
        }

        const existingUser = await this.usersRepository.findOne({
            where: {email: PUBLIC_TODO_OWNER_EMAIL},
        });

        if (existingUser) {
            if (existingUser.role !== Role.ADMIN) {
                await this.usersRepository.update(existingUser.id, {
                    role: Role.ADMIN,
                });
                this.logger.log(
                    `Promoted ${PUBLIC_TODO_OWNER_EMAIL} to ${Role.ADMIN}`,
                );
            }
            return;
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const admin = this.usersRepository.create({
            email: PUBLIC_TODO_OWNER_EMAIL,
            username: PUBLIC_TODO_OWNER_USERNAME,
            password: passwordHash,
            role: Role.ADMIN,
        });

        await this.usersRepository.save(admin);
        this.logger.log(`Seeded admin user ${PUBLIC_TODO_OWNER_EMAIL}`);
    }
}
