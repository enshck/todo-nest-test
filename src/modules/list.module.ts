import { Module } from '@nestjs/common';

import ListController from 'controllers/list.controller';
import ListService from 'providers/list.service';
import BullModule from './bull.module';

@Module({
  imports: [BullModule],
  controllers: [ListController],
  providers: [ListService],
})
export default class ListModule {}
