import {describe, expect, it, jest} from "@jest/globals";
import {
    ConflictException,
    ForbiddenException,
    UnauthorizedException,
} from "@nestjs/common";
import {Test} from "@nestjs/testing";
import {getRepositoryToken} from "@nestjs/typeorm";
import bcrypt from "bcrypt";
import {AttachmentsService} from "src/modules/attachments/attachments.service";
import {User} from "src/modules/users/users.entity";
import {UsersService} from "src/modules/users/users.service";
import {AuthenticatedUser, Role} from "src/types";
import {Repository} from "typeorm";

describe("UsersService authorization", () => {
    const owner = {id: "82c130b1-1c47-4a0c-8a1c-e79cc39282ad", role: Role.USER} as AuthenticatedUser;
    const stranger = {id: "284d7641-83fe-43aa-b973-c7202df01dc0", role: Role.USER} as AuthenticatedUser;
    const admin = {id: "03bdb2ff-ff28-442b-b99a-6068ae2051e1", role: Role.ADMIN} as AuthenticatedUser;
    async function setup() {
        const user = Object.assign(new User(), {
            id: owner.id,
            username: "reader",
            email: "reader@example.com",
            password: await bcrypt.hash("current-password", 4),
            role: Role.USER,
        });
        const repository = {
            findOne: jest.fn<Repository<User>["findOne"]>().mockResolvedValue(user),
            createQueryBuilder: jest.fn(() => ({
                addSelect: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                getOne: jest.fn(async () => user),
            })),
            save: jest.fn(async (value: User) => value),
            delete: jest.fn<Repository<User>["delete"]>().mockResolvedValue({affected: 1, raw: []}),
            update: jest.fn<Repository<User>["update"]>().mockResolvedValue({affected: 1, generatedMaps: [], raw: []}),
            manager: {
                find: jest.fn(async () => []),
                transaction: jest.fn(
                    async (
                        callback: (
                            manager: {
                                find: jest.Mock;
                                delete: jest.Mock;
                                createQueryBuilder: jest.Mock;
                            },
                        ) => Promise<void>,
                    ) =>
                    callback({
                        find: jest.fn(async () => []),
                        delete: jest.fn(async () => ({affected: 1, raw: []})),
                        createQueryBuilder: jest.fn(() => ({
                            delete: jest.fn().mockReturnThis(),
                            from: jest.fn().mockReturnThis(),
                            where: jest.fn().mockReturnThis(),
                            execute: jest.fn(async () => ({})),
                        })),
                    }),
                ),
            },
        };
        const attachmentsService = {
            deleteEntityFiles: jest
                .fn<AttachmentsService["deleteEntityFiles"]>()
                .mockResolvedValue({deleted: 0}),
        } as jest.Mocked<Pick<AttachmentsService, "deleteEntityFiles">>;
        const moduleRef = await Test.createTestingModule({
            providers: [
                UsersService,
                {provide: getRepositoryToken(User), useValue: repository},
                {provide: AttachmentsService, useValue: attachmentsService},
            ],
        }).compile();
        return {
            attachmentsService,
            repository,
            service: moduleRef.get(UsersService),
            user,
        };
    }

    it("denies reading another user to a regular user", async () => {
        const {service} = await setup();
        await expect(service.findForActor(owner.id, stranger)).rejects.toBeInstanceOf(ForbiddenException);
    });

    it("allows an administrator to read another user", async () => {
        const {service, user} = await setup();
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

        await service.changePassword(
            owner.id,
            "current-password",
            "NewStrongPassword123",
            owner,
        );

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
        await expect(
            service.changePassword(
                owner.id,
                "current-password",
                "StrongPassword123",
                admin,
            ),
        ).rejects.toBeInstanceOf(ForbiddenException);
        expect(repository.update).not.toHaveBeenCalled();
    });

    it("rejects password changes with an invalid current password", async () => {
        const {service, repository} = await setup();

        await expect(
            service.changePassword(
                owner.id,
                "wrong-password",
                "NewStrongPassword123",
                owner,
            ),
        ).rejects.toBeInstanceOf(UnauthorizedException);
        expect(repository.update).not.toHaveBeenCalled();
    });

    it("allows only administrators to physically delete a user", async () => {
        const {attachmentsService, service, repository} = await setup();

        await expect(service.delete(owner.id, owner)).rejects.toBeInstanceOf(
            ForbiddenException,
        );

        await service.delete(owner.id, admin);

        expect(attachmentsService.deleteEntityFiles).toHaveBeenCalledWith(
            "user",
            owner.id,
        );
        expect(repository.manager.transaction).toHaveBeenCalled();
    });

    it("does not change the database if user attachment deletion fails", async () => {
        const {attachmentsService, service, repository} = await setup();
        attachmentsService.deleteEntityFiles.mockRejectedValue(
            new Error("storage failed"),
        );

        await expect(service.delete(owner.id, admin)).rejects.toThrow(
            "storage failed",
        );
        expect(repository.manager.transaction).not.toHaveBeenCalled();
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
                {provide: AttachmentsService, useValue: {}},
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
                {provide: AttachmentsService, useValue: {}},
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
