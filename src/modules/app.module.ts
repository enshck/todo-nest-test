import { Module } from '@nestjs/common';

import AuthModule from './auth.module';
import ListModule from './list.module';
import BullModule from './bull.module';
import NodeMailer from './nodemailer.module';
import DBModule from './database.module';

@Module({
  imports: [AuthModule, ListModule, BullModule, NodeMailer, DBModule],
})
export class AppModule {}
