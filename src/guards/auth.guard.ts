import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';
import jwt = require('jsonwebtoken');

import variables from 'config/variables';
import Token from 'models/Tokens';

@Injectable()
class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization'];

    jwt.verify(token, variables.jwtEncryptionKey);

    const existingToken = await Token.findOne({
      where: {
        token,
      },
    });

    if (!existingToken) {
      throw new NotFoundException('User not found');
    }

    const idOfUser = existingToken.getDataValue('idOfUser');

    request.userId = idOfUser;

    return true;
  }
}

export default AuthGuard;
