import { Module } from '@nestjs/common';

import AuthModule from './auth.module';
import ListModule from './list.module';
import BullModule from './bull.module';

@Module({
  imports: [AuthModule, ListModule, BullModule],
})
export class AppModule {}
