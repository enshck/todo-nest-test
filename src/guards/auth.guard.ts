import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import jwt = require('jsonwebtoken');

import variables from 'config/variables';
import Token from 'models/Token';
import { dbTables } from 'const/dbTables';

@Injectable()
class AuthGuard implements CanActivate {
  constructor(
    @Inject(dbTables.TOKEN_TABLE)
    private tokenTable: typeof Token,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization'];

    try {
      jwt.verify(token, variables.jwtEncryptionKey);
    } catch (err) {
      throw new UnauthorizedException(err?.message ?? 'Invalid Token');
    }

    const existingToken = await this.tokenTable.findOne({
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
