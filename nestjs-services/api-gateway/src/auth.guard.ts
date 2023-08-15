import { CanActivate, ExecutionContext, HttpException, HttpStatus, Inject, Logger } from "@nestjs/common";
import { ClientRMQ } from "@nestjs/microservices";
import { lastValueFrom, timeout } from "rxjs";

export class AuthGuard implements CanActivate {
    constructor(
        @Inject('AUTH_SERVICE')
        private readonly authClient: ClientRMQ
    ) { }

    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        const req = context.switchToHttp().getRequest();
        try {
            const res = this.authClient.send(
                'validate_token',
                { jwt: req.headers['authorization']?.split(' ')[1] })
                .pipe(timeout(5000))

            const result = await lastValueFrom(res);
            req.userId = result.user._id;
            return result;
        } catch (err) {
            const errorMessage = err.error.message;
            const errorCode = err.error.code || 500;

            if (errorMessage) {
                throw new HttpException(errorMessage, errorCode);
            }
            return false;
        }
    }
}