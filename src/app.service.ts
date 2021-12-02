import { Injectable } from '@nestjs/common';

import Tokens from 'models/Tokens';
import Users from 'models/User';

@Injectable()
export class AppService {
  async getHello(): Promise<string> {
    // const result = await Users.create({
    //   userName: 'qwe',
    //   password: '123',
    // });

    // const result = await Tokens.create({
    //   UserId: 3,
    //   device: 'android',
    //   token: '123',
    // });

    const result = await Users.findOne({
      where: {
        id: 3,
      },
    });

    result.destroy();

    console.log(result.toJSON(), 'result');

    return result.toJSON();
  }
}
