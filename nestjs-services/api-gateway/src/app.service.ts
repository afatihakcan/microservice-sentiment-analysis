import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AppService {

  constructor(
    @Inject('SENTIMENT_SERVICE') private readonly sentimentClient: ClientRMQ,
    @Inject('AUTH_SERVICE') private readonly authClient: ClientRMQ,
    @Inject('USER_SERVICE') private readonly userClient: ClientRMQ
  ) { }

  async login(email: string, password: string): Promise<any> {
    const response = this.authClient.send('login', { email, password })
    return lastValueFrom(response);
  }

  async createUser(createUserDto: CreateUserDto): Promise<any> {
    const response = this.userClient.send('create_user', createUserDto)
    return lastValueFrom(response);
  }

  async analyze(text: string, userId: string): Promise<any> {
    try {
      const response = this.sentimentClient.send('sentiment_analysis', { text, userId })
      return lastValueFrom(response);
    } catch (e) {
      throw new HttpException('Internal server error', 500);
    }
  }

  async getLast10Analysis(userId: string): Promise<any> {
    const response = this.sentimentClient.send('last_10_analysis', userId)
    return lastValueFrom(response);
  }

  async deleteAnalysis(id: string, userId: string): Promise<any> {
    const response = this.sentimentClient.send('delete_analysis', {id, userId})
    return lastValueFrom(response);
  }
}
