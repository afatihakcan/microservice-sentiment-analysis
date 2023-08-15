import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { SentimentController } from './sentiment.controller';
import { SentimentService } from './sentiment.service';
import { StatSchema } from './stat.schema';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/msa-sentiment'),
    MongooseModule.forFeature([
      { name: 'Stat', schema: StatSchema }
    ]),

    ClientsModule.register([
      {
        name: 'ROBERTA_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'roberta-queue',
          queueOptions: {
            persistent: true,
            durable: false,
          },
        }
      }
    ]),

  ]
  ,
  controllers: [SentimentController],
  providers: [SentimentService],
})
export class SentimentModule { }
