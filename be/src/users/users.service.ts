import {ConflictException, Injectable, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import {Repository} from "typeorm";

import {Role} from "../types";
import {UpdateUserDto} from "./user.dto";
import {User} from "./users.entity";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}

    async findById(id: string): Promise<User> {
        const user = await this.usersRepository.findOne({where: {id}});
        if (!user) {
            throw new NotFoundException("User not found!");
        }
        return user;
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = await this.usersRepository.findOne({where: {email}});
        return user;
    }

    async create(
        email: string,
        password: string,
        role: Role,
        username?: string,
    ): Promise<User> {
        const emailExists = await this.usersRepository.findOneBy({email});
        if (emailExists) {
            throw new ConflictException("User with this email already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = this.usersRepository.create({
            email,
            username,
            password: hashedPassword,
            role,
        });
        return this.usersRepository.save(user);
    }

    async delete(id: string): Promise<void> {
        const result = await this.usersRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException("Article not found");
        }
    }

    async update(id: string, updateData: UpdateUserDto) {
        const user = await this.findById(id);

        Object.assign(user, updateData);

        return this.usersRepository.save(user);
    }

    async changePassword(id: string, password: string): Promise<void> {
        await this.findById(id);
        const hashedPassword = await bcrypt.hash(password, 10);
        await this.usersRepository.update(id, {password: hashedPassword});
    }
}
