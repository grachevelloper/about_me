import {describe, expect, it, jest} from "@jest/globals";
import {UnauthorizedException} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {Request, Response} from "express";
import {User} from "src/modules/users/users.entity";
import {UsersMapper} from "src/modules/users/users.mapper";
import {AuthController} from "src/processes/auth/auth.controller";
import {AuthService} from "src/processes/auth/auth.service";
import {RefreshTokensService} from "src/processes/auth/refresh-token/refresh-token.service";
import {clearTokenConfig} from "src/processes/auth/utils";
import {Role} from "src/types";

describe("AuthController", () => {
    const user = Object.assign(new User(), {
        id: "82c130b1-1c47-4a0c-8a1c-e79cc39282ad",
        username: "reader",
        email: "reader@example.com",
        password: "secret-hash",
        role: Role.USER,
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-02T00:00:00.000Z",
    });

    it("returns a safe user and signs an access token with sub and role", async () => {
        const authService = {
            signIn: jest.fn<AuthService["signIn"]>().mockResolvedValue(user),
        } as unknown as AuthService;
        const refreshTokens = {
            createToken: jest
                .fn<RefreshTokensService["createToken"]>()
                .mockResolvedValue("refresh-token"),
        } as unknown as RefreshTokensService;
        const jwt = {
            signAsync: jest
                .fn<JwtService["signAsync"]>()
                .mockResolvedValue("access-token"),
        } as unknown as JwtService;
        const response = {cookie: jest.fn()} as unknown as Response;
        const controller = new AuthController(authService, refreshTokens, jwt);

        const result = await controller.signIn(
            {email: user.email, password: "StrongPassword123"},
            response,
        );

        expect(result).toEqual(UsersMapper.toResponse(user));
        expect(result).not.toHaveProperty("password");
        expect(jwt.signAsync).toHaveBeenCalledWith({
            sub: user.id,
            role: Role.USER,
        });
    });

    it("rejects refresh without a cookie", async () => {
        const controller = new AuthController(
            {} as AuthService,
            {} as RefreshTokensService,
            {} as JwtService,
        );

        await expect(
            controller.refresh(
                {cookies: {}} as Request,
                {} as Response,
            ),
        ).rejects.toEqual(
            new UnauthorizedException("Refresh token not found"),
        );
    });

    it("rejects a refresh token that is invalid, expired, or revoked", async () => {
        const refreshTokens = {
            findByHash: jest
                .fn<RefreshTokensService["findByHash"]>()
                .mockResolvedValue(null),
        } as unknown as RefreshTokensService;
        const controller = new AuthController(
            {} as AuthService,
            refreshTokens,
            {} as JwtService,
        );

        await expect(
            controller.refresh(
                {cookies: {refreshToken: "unusable"}} as unknown as Request,
                {} as Response,
            ),
        ).rejects.toEqual(new UnauthorizedException("Invalid refresh token"));
    });

    it("rotates a refresh token and keeps role in the access token", async () => {
        const authService = {
            isMe: jest.fn<AuthService["isMe"]>().mockResolvedValue(user),
        } as unknown as AuthService;
        const refreshTokens = {
            findByHash: jest
                .fn<RefreshTokensService["findByHash"]>()
                .mockResolvedValue(
                    Object.assign(new (class {})(), {userId: user.id}) as never,
                ),
            revokeToken: jest
                .fn<RefreshTokensService["revokeToken"]>()
                .mockResolvedValue(),
            createToken: jest
                .fn<RefreshTokensService["createToken"]>()
                .mockResolvedValue("new-refresh"),
        } as unknown as RefreshTokensService;
        const jwt = {
            signAsync: jest
                .fn<JwtService["signAsync"]>()
                .mockResolvedValue("new-access"),
        } as unknown as JwtService;
        const response = {cookie: jest.fn()} as unknown as Response;
        const controller = new AuthController(authService, refreshTokens, jwt);

        await controller.refresh(
            {cookies: {refreshToken: "old-refresh"}} as unknown as Request,
            response,
        );

        expect(refreshTokens.revokeToken).toHaveBeenCalledWith(
            user.id,
            "old-refresh",
        );
        expect(jwt.signAsync).toHaveBeenCalledWith({
            sub: user.id,
            role: Role.USER,
        });
        expect(refreshTokens.createToken).toHaveBeenCalledWith(user.id);
    });

    it("clears both authentication cookies on logout", async () => {
        const refreshTokens = {
            revokeToken: jest
                .fn<RefreshTokensService["revokeToken"]>()
                .mockResolvedValue(),
        } as unknown as RefreshTokensService;
        const response = {clearCookie: jest.fn()} as unknown as Response;
        const controller = new AuthController(
            {} as AuthService,
            refreshTokens,
            {} as JwtService,
        );

        await controller.logout(
            {cookies: {refreshToken: "refresh-token"}} as unknown as Request,
            {id: user.id, role: user.role} as never,
            response,
        );

        expect(refreshTokens.revokeToken).toHaveBeenCalledWith(
            user.id,
            "refresh-token",
        );
        expect(response.clearCookie).toHaveBeenCalledWith(
            "accessToken",
            clearTokenConfig(),
        );
        expect(response.clearCookie).toHaveBeenCalledWith(
            "refreshToken",
            clearTokenConfig(),
        );
    });
});
