import { BadRequestException, CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";
import { AuthService } from "./auth.service";

export interface ExtendedRequest extends Request {
    user: {
        id: string;
        email: string;
    }
}



@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly authService: AuthService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException({ success: false, message: "Access denied !!" });
        }

        try {
            const payload = this.authService.verifyToken(token);
            if (!payload) throw new BadRequestException({ success: false, message: "Access denied !!" });
            request['user'] = payload;
        } catch {
            throw new UnauthorizedException({ success: false, message: "Access denied !!" });
        }

        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const token = request.cookies.auth_token || request.headers['authorization'];
        return token;
    }
}