import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
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
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
