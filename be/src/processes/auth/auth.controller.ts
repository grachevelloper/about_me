import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Req,
    Res,
    UseGuards,
} from "@nestjs/common";
import {Request, Response} from "express";

import {UserResponseDto} from "@/users/dto/user-response.dto";
import {SigninUserDto, SignupUserDto} from "@/users/user.dto";
import {UsersMapper} from "@/users/users.mapper";

import {Public} from "../../shared/decorators/auth.decorator";
import {CurrentUser} from "../../shared/decorators/current-user.decorator";
import {AuthGuard} from "../../shared/guards/auth.guard";
import {AuthenticatedUser} from "../../types";
import {AuthService} from "./auth.service";
import {ACCESS_TOKEN_TTL_IN_MS, REFRESH_TOKEN_TTL_IN_MS} from "./constants";
import {clearTokenConfig, tokenConfig} from "./utils";

@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) {}

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

        await this.setTokenCookies(result, response);
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

        await this.setTokenCookies(result, response);
        return UsersMapper.toResponse(result);
    }

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post("/refresh")
    async refresh(
        @Req() request: Request,
        @Res({passthrough: true}) response: Response,
    ) {
        const result = await this.authService.refresh(
            request.cookies?.refreshToken,
        );

        this.setCookies(response, result.accessToken, result.refreshToken);

        return {message: "Tokens refreshed successfully"};
    }

    @HttpCode(HttpStatus.OK)
    @Post("/logout")
    async logout(
        @Req() req: Request,
        @CurrentUser() user: AuthenticatedUser,
        @Res({passthrough: true}) response: Response,
    ) {
        await this.authService.logout(user.id, req.cookies?.refreshToken);

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

    private async setTokenCookies(
        user: Parameters<AuthService["issueTokens"]>[0],
        response: Response,
    ): Promise<void> {
        const {accessToken, refreshToken} =
            await this.authService.issueTokens(user);

        this.setCookies(response, accessToken, refreshToken);
    }

    private setCookies(
        response: Response,
        accessToken: string,
        refreshToken: string,
    ): void {
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
