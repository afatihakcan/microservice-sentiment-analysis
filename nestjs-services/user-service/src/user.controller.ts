import { Controller, UseFilters } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { LoginDto } from 'dto/login.dto';
import { MongoServerErrorFilter } from './mongo-exception.filter';
import { User } from './user.schema';
import { UserService } from './user.service';

@Controller()
@UseFilters(MongoServerErrorFilter)
export class UserController {
  constructor(private readonly userService: UserService) { }

  @MessagePattern('create_user')
  async create(user: User): Promise<any> {
    return await this.userService.create(user);
  }

  @MessagePattern('get_user_by_id')
  async getUserById(id: any): Promise<any> {
    return await this.userService.getUserById(id);
  }

  @MessagePattern('get_user_by_email_and_password')
  async getUserByEmailAndPassword(loginDto: LoginDto): Promise<any> {
    return await this.userService.getUserByEmailAndPassword(loginDto.email, loginDto.password);
  }

}
