import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @MessagePattern('login')
  async login(payload: any): Promise<any> {
    return await this.authService.login(payload);
  }

  @MessagePattern('validate_token')
  async validateToken(payload: any): Promise<any> {
    return await this.authService.validateToken(payload.jwt);
  }
}
