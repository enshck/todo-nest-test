import { Injectable, Inject } from '@nestjs/common';
import { Queue, Job } from 'bull';
import { InjectQueue, Processor, Process } from '@nestjs/bull';
import moment = require('moment');
import { Op } from 'sequelize';

import Todo from 'models/Todo';
import { dbTables } from 'const/dbTables';
import { queueTypes } from 'const/queueBull';
import { NodeMailerService } from 'providers/nodemailer.service';

@Injectable()
export class BullService {
  constructor(
    @InjectQueue(queueTypes.SEND_EMAILS) private sendEmailsQueue: Queue,
    @InjectQueue(queueTypes.CREATE_LIST) private createListQueue: Queue,
    @Inject(dbTables.TODO_TABLE) private todoRepository: typeof Todo,
  ) {
    this.sendEmailsQueue = sendEmailsQueue;
    const initRepeatableJob = async () => {
      // init job for adding jobs for current day
      await this.createListQueue.empty();
      await this.createListQueue.add(
        {},
        {
          repeat: {
            cron: '00 00 * * *',
          },
        },
      );
    };

    const initJobsForToday = async () => {
      // adding jobs for current day(initial)
      await this.sendEmailsQueue.empty();
      const todosData = await this.todoRepository.findAll({
        where: {
          scheduleAt: {
            [Op.gt]: moment().format('YYYY-MM-DD HH:mm'),
            [Op.lte]: moment().format('YYYY-MM-DD 23:59'),
          },
        },
        include: ['User'],
      });
      const dataForBulkCreate = todosData.map((elem) => {
        const userEmail = elem.getDataValue('User')?.email;
        const todoId = elem.getDataValue('id');
        const scheduleAt = elem.getDataValue('scheduleAt');
        const delay = +new Date(scheduleAt) - +new Date();
        return {
          data: {
            userEmail,
            todoId,
          },
          opts: {
            removeOnComplete: true,
            removeOnFail: true,
            jobId: todoId,
            delay,
          },
        };
      });
      this.sendEmailsQueue.addBulk(dataForBulkCreate);
    };

    initRepeatableJob();
    initJobsForToday();
  }

  async createJob(userEmail: string, todoId: string, scheduleAt: string) {
    const delay = +new Date(scheduleAt) - +new Date();

    this.sendEmailsQueue.add(
      {
        userEmail,
        todoId,
      },
      {
        removeOnComplete: true,
        removeOnFail: true,
        jobId: todoId,
        delay,
      },
    );
  }

  async updateJob(userEmail: string, todoId: string, scheduleAt: string) {
    try {
      const job = await this.sendEmailsQueue.getJob(todoId);
      await job?.remove();
    } catch (err) {
      console.log('Not exist. Creating..');
    }

    await this.createJob(userEmail, todoId, scheduleAt);
  }

  async deleteJob(todoId: string) {
    const job = await this.sendEmailsQueue.getJob(todoId);
    await job?.remove();
  }
}

interface IJobData {
  userEmail: string;
  todoId: string;
}

@Processor(queueTypes.SEND_EMAILS)
export class SendEmailConsumer {
  constructor(
    private readonly nodeMailerService: NodeMailerService,
    @Inject(dbTables.TODO_TABLE) private todoRepository: typeof Todo,
  ) {}
  @Process()
  async sendEmails(job: Job<IJobData>) {
    const { todoId, userEmail } = job?.data;

    if (!todoId || !userEmail) {
      return;
    }

    const todo = await this.todoRepository.findOne({
      where: {
        id: todoId,
      },
    });

    const todoValue = todo.getDataValue('value');

    console.log('Sending email...');

    await this.nodeMailerService.sendTodoElement(userEmail, todoValue);

    console.log('Email has been sended');
  }
}

@Processor(queueTypes.CREATE_LIST)
export class CreateJobListConsumer {
  constructor(
    @InjectQueue(queueTypes.SEND_EMAILS) private sendEmailsQueue: Queue,
    @Inject(dbTables.TODO_TABLE) private todoRepository: typeof Todo,
  ) {}

  @Process()
  async createJobList() {
    const todosData = await this.todoRepository.findAll({
      where: {
        scheduleAt: {
          [Op.gt]: moment().format('YYYY-MM-DD 00:00'),
          [Op.lte]: moment().format('YYYY-MM-DD 23:59'),
        },
      },
      include: ['User'],
    });

    const dataForBulkCreate = todosData.map((elem) => {
      const userEmail = elem.getDataValue('User')?.email;
      const todoId = elem.getDataValue('id');
      const scheduleAt = elem.getDataValue('scheduleAt');
      const delay = +new Date(scheduleAt) - +new Date();

      return {
        data: {
          userEmail,
          todoId,
        },
        opts: {
          removeOnComplete: true,
          removeOnFail: true,
          jobId: todoId,
          delay,
        },
      };
    });

    this.sendEmailsQueue.addBulk(dataForBulkCreate);
  }
}
