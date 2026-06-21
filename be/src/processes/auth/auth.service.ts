import {Injectable, UnauthorizedException} from "@nestjs/common";
import bcrypt from "bcrypt";

import {User} from "../../modules/users/users.entity";
import {UsersService} from "../../modules/users/users.service";
import {Role} from "../../types";

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) {}

    async signUp(
        username: string,
        email: string,
        password: string,
    ): Promise<User> {
        const user = await this.usersService.create({
            email,
            password,
            username,
            role: Role.USER,
        });

        return user;
    }

    async signIn(email: string, pass: string): Promise<User> {
        const user = await this.usersService.findByEmail(email);

        if (!user) {
            throw new UnauthorizedException("Invalid credentials");
        }
        if (!(await bcrypt.compare(pass, user.password))) {
            throw new UnauthorizedException("Invalid credentials");
        }
        return user;
    }

    async isMe(id: string): Promise<User> {
        const user = await this.usersService.findById(id);

        return user;
    }
}
