import {describe, expect, it} from "@jest/globals";
import {User} from "src/modules/users/users.entity";
import {UsersMapper} from "src/modules/users/users.mapper";
import {Role} from "src/types";

describe("UsersMapper", () => {
    it("maps a user without exposing the password", () => {
        const user = Object.assign(new User(), {
            id: "82c130b1-1c47-4a0c-8a1c-e79cc39282ad",
            username: "reader",
            email: "reader@example.com",
            password: "secret-hash",
            role: Role.USER,
            avatar: undefined,
            nowReading: "A book",
            nowWatch: undefined,
            nowBeingIn: undefined,
            nowListening: undefined,
            createdAt: "2026-01-01T00:00:00.000Z",
            updatedAt: "2026-01-02T00:00:00.000Z",
        });

        const result = UsersMapper.toResponse(user);

        expect(result).toEqual({
            id: user.id,
            username: "reader",
            email: "reader@example.com",
            role: Role.USER,
            avatar: null,
            nowReading: "A book",
            nowWatch: null,
            nowBeingIn: null,
            nowListening: null,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        });
        expect(result).not.toHaveProperty("password");
    });
});
