import { ArgumentsHost, Catch, RpcExceptionFilter } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { Observable, throwError } from "rxjs";

@Catch(RpcException)
export class CustomRpcExceptionFilter implements RpcExceptionFilter {
    catch(e: RpcException, host: ArgumentsHost): Observable<any> {
        return throwError(() => new RpcException(e.getError()));
    }
}