import { Module } from '@nestjs/common';

import AuthModule from './auth.module';
import ListModule from './list.module';
import DBModule from './database.module';

@Module({
  imports: [DBModule, AuthModule, ListModule],
})
export class AppModule {}
