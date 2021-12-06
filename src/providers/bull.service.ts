import { BadRequestException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Queue, Job } from 'bull';
import { InjectQueue, Processor, Process } from '@nestjs/bull';

import UserModel from 'models/User';

@Injectable()
export class BullService {
  constructor(@InjectQueue('SEND_EMAILS') private sendEmailsQueue: Queue) {
    this.sendEmailsQueue = sendEmailsQueue;
    // const initJobs = async () => {
    //   const repeatableJobs = await sendEmailsQueue.getRepeatableJobs();
    //   repeatableJobs.map((elem) => {
    //     sendEmailsQueue.removeRepeatableByKey(elem.key);
    //   });
    //   const allUsers = await UserModel.findAll();
    //   const jobs = allUsers.map((elem: any) => ({
    //     data: {
    //       userEmail: elem?.email,
    //     },
    //     opts: {
    //       removeOnComplete: true,
    //       repeat: {
    //         cron: '00 15 * * *',
    //       },
    //     },
    //   }));
    //   sendEmailsQueue.addBulk(jobs);
    // };
    // initJobs();
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

@Processor('SEND_EMAILS')
export class SendEmailConsumer {
  @Process()
  async sendEmails(job: Job<unknown>) {
    console.log(job.data, 'delay');
  }
}
