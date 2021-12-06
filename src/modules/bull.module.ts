import { Module } from '@nestjs/common';
import { BullModule as Bull } from '@nestjs/bull';

import variables from 'config/variables';
import { BullService, SendEmailConsumer } from 'providers/bull.service';

@Module({
  imports: [
    Bull.forRoot({
      redis: {
        host: variables.redisUrl,
        port: +variables.redisPort,
        password: variables.redisPassword,
        username: variables.redisUser,
      },
    }),
    Bull.registerQueue({
      name: 'SEND_EMAILS',
    }),
  ],
  providers: [BullService, SendEmailConsumer],
  exports: [BullService],
})
export default class BullModule {}
