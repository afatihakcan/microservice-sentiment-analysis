import { Inject, Injectable } from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AppService {

  constructor(
    @Inject('SENTIMENT_SERVICE') private readonly client: ClientRMQ,
  ) { }


  async analyze(text: string): Promise<any> {
    const response = this.client.send('sentiment_analysis', text)
    return lastValueFrom(response);
  }
}
