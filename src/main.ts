import { NestFactory } from '@nestjs/core';

import { AppModule } from 'modules/app.module';
import variables from 'config/variables';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('To Do List')
    .setDescription('The TO DO API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(variables.port);
}

bootstrap();
