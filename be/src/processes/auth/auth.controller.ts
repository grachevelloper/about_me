import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Req,
    Res,
    UnauthorizedException,
    UseGuards,
} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {Request, Response} from "express";

import {SigninUserDto, SignupUserDto} from "@/users/user.interface";

import {Public} from "../../shared/decorators/auth.decorator";
import {AuthGuard} from "../../shared/guards/auth.guard";
import {AuthService} from "./auth.service";
import {ACCESS_TOKEN_TTL_IN_MS, REFRESH_TOKEN_TTL_IN_MS} from "./constants";
import {RefreshTokensService} from "./refresh-token/refresh-token.service";
import {hashToken, tokenConfig} from "./utils";

@Controller("auth")
export class AuthController {
    constructor(
        private authService: AuthService,
        private refreshTokensService: RefreshTokensService,
        private jwtService: JwtService,
    ) {}

    @Public()
    @HttpCode(HttpStatus.CREATED)
    @Post("/signup")
    async signUp(
        @Body() signUpDto: SignupUserDto,
        @Res({passthrough: true}) response: Response,
    ) {
        const result = await this.authService.signUp(
            signUpDto.username,

            signUpDto.email,
            signUpDto.password,
        );

        const payload = {sub: result.id, email: result.email};
        const refreshToken = await this.refreshTokensService.createToken(
            result.id,
        );
        const accessToken = await this.jwtService.signAsync(payload);

        response.cookie(
            "refreshToken",
            refreshToken,
            tokenConfig(REFRESH_TOKEN_TTL_IN_MS),
        );

        response.cookie(
            "accessToken",
            accessToken,
            tokenConfig(ACCESS_TOKEN_TTL_IN_MS),
        );

        return result;
    }

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post("/signin")
    async signIn(
        @Body() signInDto: SigninUserDto,
        @Res({passthrough: true}) response: Response,
    ) {
        const result = await this.authService.signIn(
            signInDto.email,
            signInDto.password,
        );

        const payload = {sub: result.id, email: result.email};
        const refreshToken = await this.refreshTokensService.createToken(
            result.id,
        );
        const accessToken = await this.jwtService.signAsync(payload);

        response.cookie(
            "refreshToken",
            refreshToken,
            tokenConfig(REFRESH_TOKEN_TTL_IN_MS),
        );

        response.cookie(
            "accessToken",
            accessToken,
            tokenConfig(ACCESS_TOKEN_TTL_IN_MS),
        );

        return result;
    }

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post("/refresh")
    async refresh(
        @Req() request: Request,
        @Res({passthrough: true}) response: Response,
    ) {
        const refreshToken = request.cookies?.refreshToken;

        if (!refreshToken) {
            throw new UnauthorizedException("Refresh token not found");
        }

        const tokenHash = hashToken(refreshToken);
        const tokenEntity =
            await this.refreshTokensService.findByHash(tokenHash);

        if (!tokenEntity) {
            throw new UnauthorizedException("Invalid refresh token");
        }

        const userId = tokenEntity.userId;

        await this.refreshTokensService.revokeToken(userId, refreshToken);

        const [accessToken, newRefreshToken] = await Promise.all([
            this.jwtService.signAsync({sub: userId}),
            this.refreshTokensService.createToken(userId),
        ]);

        response.cookie(
            "accessToken",
            accessToken,
            tokenConfig(ACCESS_TOKEN_TTL_IN_MS),
        );

        response.cookie(
            "refreshToken",
            newRefreshToken,
            tokenConfig(REFRESH_TOKEN_TTL_IN_MS),
        );

        return {message: "Tokens refreshed successfully"};
    }

    @HttpCode(HttpStatus.OK)
    @Post("/logout")
    async logout(
        @Req() req: Request,
        @Res({passthrough: true}) response: Response,
    ) {
        const refreshToken = req.cookies?.refreshToken;
        if (refreshToken) {
            await this.refreshTokensService.revokeToken(
                req.user.id,
                refreshToken,
            );
        }

        response.clearCookie("accessToken", {
            path: "/",
        });
        response.clearCookie("refreshToken", {
            path: "/",
        });

        return {message: "Logged out successfully"};
    }

    @HttpCode(HttpStatus.OK)
    @Get("check")
    @UseGuards(AuthGuard)
    check(@Req() req: Request) {
        return !!req.user;
    }

    @HttpCode(HttpStatus.OK)
    @Get("me")
    @UseGuards(AuthGuard)
    getMe(@Req() req: Request) {
        return this.authService.isMe(req.user.id);
    }
}
