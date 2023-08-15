import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AuthModule } from './auth.module';
import { CustomRpcExceptionFilter } from './rpc-exception.filter';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://localhost:5672'],
        queue: 'auth-queue',
        queueOptions: {
          persistent: true,
          durable: false,
        }
      },
    }
  );
  app.useGlobalFilters(new CustomRpcExceptionFilter());
  await app.listen();
}
bootstrap();