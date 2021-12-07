import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class NodeMailerService {
  constructor(private readonly mailerService: MailerService) {}

  async sendTodoElement(userEmail: string, todoElement: string) {
    try {
      await this.mailerService.sendMail({
        to: userEmail,
        from: 'noreply.todo@gmail.com',
        subject: 'Notification',
        html: `<div>${todoElement}</div>`,
      });
    } catch (err) {
      console.log(err, 'error');
      throw new InternalServerErrorException('Invalid Email');
    }
  }
}
