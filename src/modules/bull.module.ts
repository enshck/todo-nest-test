import { Module } from '@nestjs/common';
import { BullModule as Bull } from '@nestjs/bull';

import variables from 'config/variables';
import {
  BullService,
  SendEmailConsumer,
  CreateJobListConsumer,
} from 'providers/bull.service';
import { queueTypes } from 'const/queueBull';
import NodeMailer from './nodemailer.module';

import DatabaseModule from './database.module';
@Module({
  imports: [
    Bull.forRoot({
      redis: {
        host: variables.redisUrl,
        port: +variables.redisPort,
      },
    }),
    Bull.registerQueue({
      name: queueTypes.SEND_EMAILS,
    }),
    Bull.registerQueue({
      name: queueTypes.CREATE_LIST,
    }),
    NodeMailer,
    DatabaseModule,
  ],
  providers: [BullService, SendEmailConsumer, CreateJobListConsumer],
  exports: [BullService],
})
export default class BullModule {}
