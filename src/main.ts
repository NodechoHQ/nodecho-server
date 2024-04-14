import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('/api');
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder().setTitle('Nodecho API').build();
  const document = SwaggerModule.createDocument(app, config, {
    ignoreGlobalPrefix: true,
  });
  SwaggerModule.setup('/api/docs', app, document);

  await app.listen(3000);
  console.log(`Server is running on ${await app.getUrl()}`);
}
bootstrap();
