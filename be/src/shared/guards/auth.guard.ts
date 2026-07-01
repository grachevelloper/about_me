import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import {Reflector} from "@nestjs/core";
import {JwtService} from "@nestjs/jwt";
import {Request} from "express";
import {JWT_SECRET} from "src/processes/auth/constants";

import {Role} from "../../types";
import {IS_PUBLIC_KEY} from "../decorators/auth.decorator";

interface JwtPayload {
    role: Role;
    sub: string;
    iat: number;
    exp: number;
}

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private reflector: Reflector,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(
            IS_PUBLIC_KEY,
            [context.getHandler(), context.getClass()],
        );

        const req: Request = context.switchToHttp().getRequest();
        const token = req.cookies.accessToken;

        if (!token) {
            if (isPublic) {
                return true;
            }

            throw new UnauthorizedException();
        }

        try {
            const payload = await this.jwtService.verifyAsync<JwtPayload>(
                token,
                {
                    secret: JWT_SECRET,
                },
            );

            const user = {
                id: payload.sub,
                iat: payload.iat,
                role: payload.role,
                exp: payload.exp,
            };

            req["user"] = user;
        } catch {
            if (isPublic) {
                return true;
            }

            throw new UnauthorizedException();
        }

        return true;
    }
}
