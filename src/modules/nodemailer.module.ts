import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

import variables from 'config/variables';
import { NodeMailerService } from 'providers/nodemailer.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          secure: false,
          service: 'Gmail',
          auth: {
            user: variables.emailSendUser,
            pass: variables.emailSendPassword,
          },
        },
        defaults: {
          from: 'ToDoList',
        },
        template: {
          dir: process.cwd() + '/templates/',
          adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  providers: [NodeMailerService],
  exports: [NodeMailerService],
})
export default class NodeMailer {}
