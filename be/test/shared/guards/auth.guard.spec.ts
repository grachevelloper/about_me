import {describe, expect, it, jest} from "@jest/globals";
import {ExecutionContext, UnauthorizedException} from "@nestjs/common";
import {Reflector} from "@nestjs/core";
import {JwtService} from "@nestjs/jwt";
import {AuthGuard} from "src/shared/guards/auth.guard";

function contextWithCookies(cookies: Record<string, string>): ExecutionContext {
    return {
        getHandler: jest.fn(),
        getClass: jest.fn(),
        switchToHttp: () => ({getRequest: () => ({cookies})}),
    } as unknown as ExecutionContext;
}

describe("AuthGuard", () => {
    it("rejects a request without an access cookie", async () => {
        const guard = new AuthGuard(
            {} as JwtService,
            {getAllAndOverride: jest.fn(() => false)} as unknown as Reflector,
        );

        await expect(
            guard.canActivate(contextWithCookies({})),
        ).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it.each(["invalid token", "jwt expired"])(
        "rejects verification failure: %s",
        async (message) => {
            const jwt = {
                verifyAsync: jest.fn(async () => {
                    throw new Error(message);
                }),
            } as unknown as JwtService;
            const guard = new AuthGuard(jwt, {
                getAllAndOverride: jest.fn(() => false),
            } as unknown as Reflector);

            await expect(
                guard.canActivate(contextWithCookies({accessToken: "token"})),
            ).rejects.toBeInstanceOf(UnauthorizedException);
        },
    );
});
