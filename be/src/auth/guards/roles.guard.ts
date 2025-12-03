import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";
import {Reflector} from "@nestjs/core";
import {Request} from "express";

import {ROLES_KEY} from "@/decorators/role.decorator";

import {Role} from "../../types";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
            ROLES_KEY,
            [context.getHandler(), context.getClass()],
        );

        if (!requiredRoles) {
            return true;
        }

        const request = context.switchToHttp().getRequest<Request>();
        const userRole = request.user?.role;

        if (!userRole) {
            return false;
        }

        return requiredRoles.some((role) => userRole === role);
    }
}
