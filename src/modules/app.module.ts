import { Module } from '@nestjs/common';

import AuthModule from './auth.module';
import ListModule from './list.module';
import BullModule from './bull.module';
import NodeMailer from './nodemailer.module';
import DBModule from './database.module';

@Module({
  imports: [DBModule, AuthModule, ListModule, BullModule, NodeMailer],
})
export class AppModule {}
