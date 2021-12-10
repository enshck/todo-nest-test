import { Test } from '@nestjs/testing';
import { BullModule as Bull } from '@nestjs/bull';
import moment = require('moment');

import { queueTypes } from 'const/queueBull';
import NodeMailer from 'modules/nodemailer.module';
import {
  BullService,
  SendEmailConsumer,
  CreateJobListConsumer,
} from 'providers/bull.service';
import variables from 'config/variables';
import DBModule from 'modules/database.module';

export interface ICreatedTodoElementResult {
  userEmail: string;
  todoId: string;
  scheduleAt: string;
}

describe('BullModule', () => {
  let bullService: BullService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
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
        DBModule,
      ],
      providers: [BullService, SendEmailConsumer, CreateJobListConsumer],
      exports: [],
    }).compile();

    bullService = moduleRef.get<BullService>(BullService);
  });

  const todoId = 'exampleId';

  describe('bullModule-createJob', () => {
    it('creating job...', async () => {
      await bullService.createJob(
        'example@example.com',
        todoId,
        moment().add(2, 'd').toISOString(),
      );
    });
  });

  describe('bullModule-updateJob', () => {
    it('updating job...', async () => {
      await bullService.updateJob(
        'example@example.com',
        todoId,
        moment().add(2, 'd').toISOString(),
      );
    });
  });

  describe('bullModule-deleteJob', () => {
    it('deleting job...', async () => {
      await bullService.deleteJob(todoId);
    });
  });
});
