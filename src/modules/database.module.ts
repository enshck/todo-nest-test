import { Module, Global } from '@nestjs/common';
import { databaseServices } from 'providers/database.service';

@Global()
@Module({
  providers: [...databaseServices],
  exports: [...databaseServices],
})
export default class DatabaseModule {}
