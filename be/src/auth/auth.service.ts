import {
    ConflictException,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";

import {Role} from "../types";
import {User} from "../users/users.entity";
import {UsersService} from "../users/users.service";

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) {}

    async signUp(
        username: string,
        email: string,
        password: string,
    ): Promise<User> {
        const existingUser = await this.usersService.findByEmail(email);

        if (existingUser) {
            throw new ConflictException("User with this email already exists");
        }

        const user = await this.usersService.create(
            email,
            password,
            Role.USER,
            username,
        );

        return user;
    }

    async signIn(email: string, pass: string): Promise<User> {
        const user = await this.usersService.findByEmail(email);
        if (user?.password !== pass) {
            throw new UnauthorizedException();
        }
        return user;
    }

    async isMe(id: string) {
        const user = await this.usersService.findById(id);

        return user;
    }
}
