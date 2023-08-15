import { Inject, Injectable } from '@nestjs/common';
import { ClientRMQ, RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { lastValueFrom } from 'rxjs';
import { AnalyzeRequestDto } from './dto/analyze-request.dto';
import { ResultDto } from './dto/result.dto';
import { Stat } from './stat.schema';

@Injectable()
export class SentimentService {

  constructor(
    @InjectModel('Stat') private statModel: Model<Stat>,
    @Inject('ROBERTA_SERVICE') private readonly client: ClientRMQ,
  ) { }


  async analyze(request: AnalyzeRequestDto): Promise<any | RpcException> {
    const response = this.client.send('analyze', request.text)
    return lastValueFrom(response);
  }

  async createStat(userId: string, text: string, result: ResultDto): Promise<any> {
    const createdStat = new this.statModel({ userId, text, result });
    return createdStat.save();
  }

  async getLast10Analysis(userId: string): Promise<any> {
    const last10 = await this.statModel.find({ userId }).sort({ createdAt: -1 }).limit(10).exec();
    return last10;
  }

  async deleteAnalysis(id: string, userId: string) {
    const deleted = await this.statModel.findOneAndDelete({ _id: id, userId });
    return deleted;
  }
}
