import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get("/analyze")
  async getAnalysis(@Query('text') text: string): Promise<any> {
    return await this.appService.analyze(text);
  }
}
