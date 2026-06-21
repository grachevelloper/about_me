import {describe, expect, it, jest} from "@jest/globals";
import {ConflictException, ForbiddenException} from "@nestjs/common";
import {Test} from "@nestjs/testing";
import {getRepositoryToken} from "@nestjs/typeorm";
import bcrypt from "bcrypt";
import {User} from "src/modules/users/users.entity";
import {UsersService} from "src/modules/users/users.service";
import {AuthenticatedUser, Role} from "src/types";
import {Repository} from "typeorm";

describe("UsersService authorization", () => {
    const owner = {id: "82c130b1-1c47-4a0c-8a1c-e79cc39282ad", role: Role.USER} as AuthenticatedUser;
    const stranger = {id: "284d7641-83fe-43aa-b973-c7202df01dc0", role: Role.USER} as AuthenticatedUser;
    const admin = {id: "03bdb2ff-ff28-442b-b99a-6068ae2051e1", role: Role.ADMIN} as AuthenticatedUser;
    const user = Object.assign(new User(), {
        id: owner.id,
        username: "reader",
        email: "reader@example.com",
        password: "hash",
        role: Role.USER,
    });

    async function setup() {
        const repository = {
            findOne: jest.fn<Repository<User>["findOne"]>().mockResolvedValue(user),
            save: jest.fn(async (value: User) => value),
            delete: jest.fn<Repository<User>["delete"]>().mockResolvedValue({affected: 1, raw: []}),
            update: jest.fn<Repository<User>["update"]>().mockResolvedValue({affected: 1, generatedMaps: [], raw: []}),
        };
        const moduleRef = await Test.createTestingModule({
            providers: [UsersService, {provide: getRepositoryToken(User), useValue: repository}],
        }).compile();
        return {service: moduleRef.get(UsersService), repository};
    }

    it("denies reading another user to a regular user", async () => {
        const {service} = await setup();
        await expect(service.findForActor(owner.id, stranger)).rejects.toBeInstanceOf(ForbiddenException);
    });

    it("allows an administrator to read another user", async () => {
        const {service} = await setup();
        await expect(service.findForActor(owner.id, admin)).resolves.toBe(user);
    });

    it("prevents a regular user from changing their role", async () => {
        const {service, repository} = await setup();
        await expect(service.update(owner.id, {role: Role.ADMIN}, owner)).rejects.toBeInstanceOf(ForbiddenException);
        expect(repository.save).not.toHaveBeenCalled();
    });

    it("allows a user to update their own profile", async () => {
        const {service, repository} = await setup();

        await service.update(owner.id, {username: "updated-reader"}, owner);

        expect(repository.save).toHaveBeenCalledWith(
            expect.objectContaining({
                id: owner.id,
                username: "updated-reader",
            }),
        );
    });

    it("hashes a new password for the current user", async () => {
        const {service, repository} = await setup();

        await service.changePassword(owner.id, "NewStrongPassword123", owner);

        const passwordUpdate = repository.update.mock.calls[0][1] as {
            password: string;
        };
        expect(passwordUpdate.password).not.toBe("NewStrongPassword123");
        await expect(
            bcrypt.compare("NewStrongPassword123", passwordUpdate.password),
        ).resolves.toBe(true);
    });

    it("prevents changing another user's password even for an administrator", async () => {
        const {service, repository} = await setup();
        await expect(service.changePassword(owner.id, "StrongPassword123", admin)).rejects.toBeInstanceOf(ForbiddenException);
        expect(repository.update).not.toHaveBeenCalled();
    });
});

describe("UsersService creation", () => {
    it("hashes a password before persistence", async () => {
        const repository = {
            findOneBy: jest.fn(async () => null),
            create: jest.fn((value) => value),
            save: jest.fn(async (value) => value),
        };
        const moduleRef = await Test.createTestingModule({
            providers: [
                UsersService,
                {provide: getRepositoryToken(User), useValue: repository},
            ],
        }).compile();
        const service = moduleRef.get(UsersService);

        await service.create({
            username: "reader",
            email: "reader@example.com",
            password: "StrongPassword123",
            role: Role.USER,
        });

        const persisted = repository.create.mock.calls[0][0] as Partial<User>;
        expect(persisted.password).not.toBe("StrongPassword123");
        await expect(
            bcrypt.compare("StrongPassword123", persisted.password!),
        ).resolves.toBe(true);
    });

    it("rejects a duplicate email", async () => {
        const repository = {
            findOneBy: jest.fn(async () => new User()),
        };
        const moduleRef = await Test.createTestingModule({
            providers: [
                UsersService,
                {provide: getRepositoryToken(User), useValue: repository},
            ],
        }).compile();
        const service = moduleRef.get(UsersService);

        await expect(
            service.create({
                username: "reader",
                email: "reader@example.com",
                password: "StrongPassword123",
                role: Role.USER,
            }),
        ).rejects.toBeInstanceOf(ConflictException);
    });
});
