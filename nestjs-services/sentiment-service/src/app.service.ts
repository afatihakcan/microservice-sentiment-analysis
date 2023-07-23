import { Inject, Injectable } from '@nestjs/common';
import { ClientRMQ, RpcException } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AppService {

  constructor(
    @Inject('ROBERTA_SERVICE') private readonly client: ClientRMQ,
  ) { }


  async analyze(payload: string): Promise<any | RpcException> {
    console.log(`payload sent to roberta-service: ${payload}`)
    
    const response = this.client.send('analyze', payload)
    return lastValueFrom(response);
  }
}
