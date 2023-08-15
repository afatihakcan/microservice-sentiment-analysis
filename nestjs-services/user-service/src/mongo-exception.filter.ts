import { ArgumentsHost, Catch, RpcExceptionFilter } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { MongoServerError } from "mongodb";
import { Observable, throwError } from "rxjs";


@Catch(MongoServerError)
export class MongoServerErrorFilter implements RpcExceptionFilter<RpcException> {
  catch(exception: Error, host: ArgumentsHost): Observable<any> {
    const errorCode = exception.message.split(' ')[0];
    if (errorCode === 'E11000') {
      const error = new RpcException(
        {
          status: 'error',
          message: 'email already exists',
          code: 400,
          service: 'auth-service',
        }
      );
      return throwError(() => error);

      // throw new RpcException('email already exists');
    } else {
      return throwError(exception);
    }

  }
}