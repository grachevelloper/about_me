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

import {UserResponseDto} from "@/users/dto/user-response.dto";
import {SigninUserDto, SignupUserDto} from "@/users/user.dto";
import {User} from "@/users/users.entity";
import {UsersMapper} from "@/users/users.mapper";

import {Public} from "../../shared/decorators/auth.decorator";
import {CurrentUser} from "../../shared/decorators/current-user.decorator";
import {AuthGuard} from "../../shared/guards/auth.guard";
import {AuthenticatedUser} from "../../types";
import {AuthService} from "./auth.service";
import {ACCESS_TOKEN_TTL_IN_MS, REFRESH_TOKEN_TTL_IN_MS} from "./constants";
import {RefreshTokensService} from "./refresh-token/refresh-token.service";
import {clearTokenConfig, hashToken, tokenConfig} from "./utils";

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
    ): Promise<UserResponseDto> {
        const result = await this.authService.signUp(
            signUpDto.username,

            signUpDto.email,
            signUpDto.password,
        );

        await this.issueTokens(result, response);
        return UsersMapper.toResponse(result);
    }

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post("/signin")
    async signIn(
        @Body() signInDto: SigninUserDto,
        @Res({passthrough: true}) response: Response,
    ): Promise<UserResponseDto> {
        const result = await this.authService.signIn(
            signInDto.email,
            signInDto.password,
        );

        await this.issueTokens(result, response);
        return UsersMapper.toResponse(result);
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

        const user = await this.authService.isMe(tokenEntity.userId);

        await this.refreshTokensService.revokeToken(user.id, refreshToken);

        const [accessToken, newRefreshToken] = await Promise.all([
            this.jwtService.signAsync({sub: user.id, role: user.role}),
            this.refreshTokensService.createToken(user.id),
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
        @CurrentUser() user: AuthenticatedUser,
        @Res({passthrough: true}) response: Response,
    ) {
        const refreshToken = req.cookies?.refreshToken;
        if (refreshToken) {
            await this.refreshTokensService.revokeToken(user.id, refreshToken);
        }

        response.clearCookie("accessToken", clearTokenConfig());
        response.clearCookie("refreshToken", clearTokenConfig());

        return {message: "Logged out successfully"};
    }

    @HttpCode(HttpStatus.OK)
    @Get("check")
    @UseGuards(AuthGuard)
    check(@CurrentUser() user: AuthenticatedUser) {
        return !!user;
    }

    @HttpCode(HttpStatus.OK)
    @Get("me")
    @UseGuards(AuthGuard)
    async getMe(
        @CurrentUser() user: AuthenticatedUser,
    ): Promise<UserResponseDto> {
        return UsersMapper.toResponse(await this.authService.isMe(user.id));
    }

    private async issueTokens(user: User, response: Response): Promise<void> {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync({sub: user.id, role: user.role}),
            this.refreshTokensService.createToken(user.id),
        ]);

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
    }
}
