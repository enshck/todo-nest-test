import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import jwt = require('jsonwebtoken');

import variables from 'config/variables';
import Token from 'models/Token';
import { dbTables } from 'const/dbTables';

@Injectable()
class AuthGuard implements CanActivate {
  constructor(
    @Inject(dbTables.TOKEN_TABLE)
    private tokenRepository: typeof Token,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization'];

    jwt.verify(token, variables.jwtEncryptionKey);

    const existingToken = await this.tokenRepository.findOne({
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
