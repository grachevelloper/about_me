import {afterEach, describe, expect, it, jest} from "@jest/globals";
import bcrypt from "bcrypt";
import {AdminSeedService} from "src/modules/users/admin-seed.service";
import {
    PUBLIC_TODO_OWNER_EMAIL,
    PUBLIC_TODO_OWNER_USERNAME,
} from "src/modules/todos/constants";
import {User} from "src/modules/users/users.entity";
import {Role} from "src/types";

describe("AdminSeedService", () => {
    const originalPassword = process.env.GRACHEVELOPERS_PASSWORD;

    afterEach(() => {
        if (originalPassword === undefined) {
            delete process.env.GRACHEVELOPERS_PASSWORD;
        } else {
            process.env.GRACHEVELOPERS_PASSWORD = originalPassword;
        }
        jest.restoreAllMocks();
    });

    it("creates the configured admin when it does not exist", async () => {
        process.env.GRACHEVELOPERS_PASSWORD = "StrongPassword123";
        const savedUsers: User[] = [];
        const usersRepository = {
            findOne: jest
                .fn<(options: unknown) => Promise<User | null>>()
                .mockResolvedValue(null),
            create: jest.fn((data: Partial<User>) => data as User),
            save: jest.fn((user: User) => {
                savedUsers.push(user);
                return Promise.resolve(user);
            }),
            update: jest.fn(),
        };
        const service = new AdminSeedService(usersRepository as never);

        await service.onApplicationBootstrap();

        expect(usersRepository.findOne).toHaveBeenCalledWith({
            where: {email: PUBLIC_TODO_OWNER_EMAIL},
        });
        expect(usersRepository.create).toHaveBeenCalledWith(
            expect.objectContaining({
                email: PUBLIC_TODO_OWNER_EMAIL,
                username: PUBLIC_TODO_OWNER_USERNAME,
                role: Role.ADMIN,
            }),
        );
        expect(savedUsers[0]).toBeDefined();
        expect(
            await bcrypt.compare("StrongPassword123", savedUsers[0]!.password),
        ).toBe(true);
    });

    it("promotes an existing configured user to admin", async () => {
        process.env.GRACHEVELOPERS_PASSWORD = "StrongPassword123";
        const existingUser = Object.assign(new User(), {
            id: "82c130b1-1c47-4a0c-8a1c-e79cc39282ad",
            email: PUBLIC_TODO_OWNER_EMAIL,
            username: PUBLIC_TODO_OWNER_USERNAME,
            role: Role.USER,
        });
        const usersRepository = {
            findOne: jest
                .fn<(options: unknown) => Promise<User | null>>()
                .mockResolvedValue(existingUser),
            create: jest.fn(),
            save: jest.fn(),
            update: jest
                .fn<(criteria: unknown, partialEntity: unknown) => Promise<unknown>>()
                .mockResolvedValue({
                affected: 1,
                generatedMaps: [],
                raw: [],
            }),
        };
        const service = new AdminSeedService(usersRepository as never);

        await service.onApplicationBootstrap();

        expect(usersRepository.update).toHaveBeenCalledWith(existingUser.id, {
            role: Role.ADMIN,
        });
        expect(usersRepository.create).not.toHaveBeenCalled();
        expect(usersRepository.save).not.toHaveBeenCalled();
    });
});
