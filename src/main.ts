import { NestFactory } from '@nestjs/core';

import { AppModule } from 'modules/app.module';
import variables from 'config/variables';
import 'config/db';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(variables.port);
}

bootstrap();
