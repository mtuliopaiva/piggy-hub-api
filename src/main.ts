import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './core/exceptions/global-exception.filter';
import { EventLogsService } from './core/eventLogs/service/eventLogs.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Piggy Hub API')
    .setDescription('Piggy Hub API documentation')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const eventLogsService = app.get(EventLogsService);
  app.useGlobalFilters(new GlobalExceptionFilter(eventLogsService));

  await app.listen(Number(process.env.PORT) || 3000);
}
bootstrap();
