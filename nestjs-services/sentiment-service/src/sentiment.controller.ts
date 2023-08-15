import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { AnalyzeRequestDto } from './dto/analyze-request.dto';
import { ResultDto } from './dto/result.dto';
import { UserAnalysisDto } from './dto/user-analysis.dto';
import { SentimentService } from './sentiment.service';

@Controller()
export class SentimentController {
  constructor(private readonly sentimentService: SentimentService) { }

  @MessagePattern('sentiment_analysis')
  async getAnalysis(@Payload() request: AnalyzeRequestDto): Promise<any> {
    const result: ResultDto = await this.sentimentService.analyze(request);
    return await this.sentimentService.createStat(request.userId, request.text, result);
  }

  @MessagePattern('last_10_analysis')
  async getLast10Analysis(@Payload() userId: string): Promise<any> {
    return await this.sentimentService.getLast10Analysis(userId);
  }

  @MessagePattern('delete_analysis')
  async deleteAnalysis(@Payload() request: UserAnalysisDto): Promise<any> {
    const deleted = await this.sentimentService.deleteAnalysis(request.id, request.userId);
    if (!!!deleted) {
      throw new RpcException({ status: 'error', message: 'Analysis not found', code: 400, service: 'sentiment-service' })
    }
  }
}
