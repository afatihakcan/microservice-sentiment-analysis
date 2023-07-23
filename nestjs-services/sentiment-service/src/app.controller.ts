import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @MessagePattern('sentiment_analysis')
  async getAnalysis(@Payload() payload: any): Promise<any> {
    const result = await this.appService.analyze(payload);
    console.log(result)
    return result;

  }
}
