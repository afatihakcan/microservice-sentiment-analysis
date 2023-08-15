import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientRMQ, RpcException } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { LoginDto } from './login.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_SERVICE') private readonly userClient: ClientRMQ,
    private readonly jwtService: JwtService,
  ) { }

  async validateUser(email: string, password: string): Promise<any> {
    return await lastValueFrom(this.userClient.send('get_user_by_email_and_password', { email, password }));
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new RpcException({ status: 'error', message: 'Invalid credentials', code: 401, service: 'auth-service' })
    }
    const payload = { user, sub: user._id };
    return {
      id: user._id,
      name: user.name,
      surname: user.surname,
      accessToken: this.jwtService.sign(payload)
    };
  }

  async validateToken(jwt: string) {
    try {
      return await this.jwtService.verifyAsync(jwt);
    } catch (e) {
      if (e.name === "TokenExpiredError") {
        throw new RpcException({ status: 'error', message: 'Token expired', code: 401, service: 'auth-service' });
      }
      if (e.name === "JsonWebTokenError") {
        throw new RpcException({ status: 'error', message: 'Invalid token', code: 401, service: 'auth-service' })
      }
    }
  }
}
