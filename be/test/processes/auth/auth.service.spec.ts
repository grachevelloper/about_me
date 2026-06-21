import {describe, expect, it, jest} from "@jest/globals";
import {UnauthorizedException} from "@nestjs/common";
import bcrypt from "bcrypt";
import {User} from "src/modules/users/users.entity";
import {UsersService} from "src/modules/users/users.service";
import {AuthService} from "src/processes/auth/auth.service";
import {Role} from "src/types";

describe("AuthService", () => {
    it("verifies a password with bcrypt", async () => {
        const user = Object.assign(new User(), {
            id: "82c130b1-1c47-4a0c-8a1c-e79cc39282ad",
            email: "reader@example.com",
            password: await bcrypt.hash("StrongPassword123", 4),
            role: Role.USER,
        });
        const usersService = {
            findByEmail: jest
                .fn<UsersService["findByEmail"]>()
                .mockResolvedValue(user),
        } as unknown as UsersService;
        const service = new AuthService(usersService);
        await expect(
            service.signIn(user.email, "StrongPassword123"),
        ).resolves.toBe(user);
    });

    it("returns the same generic error for an invalid password", async () => {
        const user = Object.assign(new User(), {
            id: "82c130b1-1c47-4a0c-8a1c-e79cc39282ad",
            email: "reader@example.com",
            password: await bcrypt.hash("StrongPassword123", 4),
            role: Role.USER,
        });
        const usersService = {
            findByEmail: jest
                .fn<UsersService["findByEmail"]>()
                .mockResolvedValue(user),
        } as unknown as UsersService;
        const service = new AuthService(usersService);

        await expect(
            service.signIn(user.email, "wrong-password"),
        ).rejects.toEqual(new UnauthorizedException("Invalid credentials"));
    });
});
