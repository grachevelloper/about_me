import {describe, expect, it, jest} from "@jest/globals";
import {HttpStatus} from "@nestjs/common";
import {HTTP_CODE_METADATA} from "@nestjs/common/constants";
import {UsersController} from "src/modules/users/users.controller";
import {User} from "src/modules/users/users.entity";
import {UsersService} from "src/modules/users/users.service";
import {AuthenticatedUser, Role} from "src/types";

describe("UsersController", () => {
    const actor = {
        id: "82c130b1-1c47-4a0c-8a1c-e79cc39282ad",
        role: Role.USER,
    } as AuthenticatedUser;
    const user = Object.assign(new User(), {
        id: actor.id,
        username: "reader",
        email: "reader@example.com",
        password: "secret-hash",
        role: Role.USER,
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-02T00:00:00.000Z",
    });

    it("maps a user read to the safe response shape", async () => {
        const service = {
            findForActor: jest
                .fn<UsersService["findForActor"]>()
                .mockResolvedValue(user),
        } as unknown as UsersService;
        const controller = new UsersController(service);

        const result = await controller.findOne(user.id, actor);

        expect(service.findForActor).toHaveBeenCalledWith(user.id, actor);
        expect(result).not.toHaveProperty("password");
    });

    it("maps current-user profile reads through the service", async () => {
        const service = {
            findForActor: jest
                .fn<UsersService["findForActor"]>()
                .mockResolvedValue(user),
        } as unknown as UsersService;
        const controller = new UsersController(service);

        const result = await controller.getMe(actor);

        expect(service.findForActor).toHaveBeenCalledWith(actor.id, actor);
        expect(result).not.toHaveProperty("password");
    });

    it("updates the current user's own profile", async () => {
        const service = {
            update: jest.fn<UsersService["update"]>().mockResolvedValue(user),
        } as unknown as UsersService;
        const controller = new UsersController(service);

        await controller.updateMe({username: "updated-reader"}, actor);

        expect(service.update).toHaveBeenCalledWith(
            actor.id,
            {username: "updated-reader"},
            actor,
        );
    });

    it("passes only the password field and actor to the password operation", async () => {
        const service = {
            changePassword: jest
                .fn<UsersService["changePassword"]>()
                .mockResolvedValue(),
        } as unknown as UsersService;
        const controller = new UsersController(service);

        await controller.changePassword(
            user.id,
            {
                currentPassword: "StrongPassword123",
                newPassword: "NewStrongPassword123",
            },
            actor,
        );

        expect(service.changePassword).toHaveBeenCalledWith(
            user.id,
            "StrongPassword123",
            "NewStrongPassword123",
            actor,
        );
    });

    it("changes the current user's own password", async () => {
        const service = {
            changePassword: jest
                .fn<UsersService["changePassword"]>()
                .mockResolvedValue(),
        } as unknown as UsersService;
        const controller = new UsersController(service);

        await controller.changeMyPassword(
            {
                currentPassword: "StrongPassword123",
                newPassword: "NewStrongPassword123",
            },
            actor,
        );

        expect(service.changePassword).toHaveBeenCalledWith(
            actor.id,
            "StrongPassword123",
            "NewStrongPassword123",
            actor,
        );
    });

    it("declares no-content status for password changes and deletion", () => {
        expect(
            Reflect.getMetadata(
                HTTP_CODE_METADATA,
                UsersController.prototype.changeMyPassword,
            ),
        ).toBe(HttpStatus.NO_CONTENT);
        expect(
            Reflect.getMetadata(
                HTTP_CODE_METADATA,
                UsersController.prototype.changePassword,
            ),
        ).toBe(HttpStatus.NO_CONTENT);
        expect(
            Reflect.getMetadata(
                HTTP_CODE_METADATA,
                UsersController.prototype.delete,
            ),
        ).toBe(HttpStatus.NO_CONTENT);
    });
});
