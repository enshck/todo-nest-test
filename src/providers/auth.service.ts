import {
  Injectable,
  Body,
  BadRequestException,
  Headers,
  NotFoundException,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { Model } from 'sequelize';
import bcrypt = require('bcrypt');
import jwt = require('jsonwebtoken');

import Token from 'models/Token';
import User from 'models/User';
import { dbTables } from 'const/dbTables';
import createUserDto from 'dto/createUser.dto';
import variables from 'config/variables';
import { IAuthResult, IUserModel } from 'interfaces/auth';
import getDevice from 'utils/getDevice';
import { IMessageResponse } from 'interfaces/common';

@Injectable()
class AuthService {
  constructor(
    @Inject(dbTables.USER_TABLE) private userTable: typeof User,
    @Inject(dbTables.TOKEN_TABLE)
    private tokenTable: typeof Token,
  ) {}
  private async getUser(
    @Body() body: createUserDto,
  ): Promise<Model<IUserModel> | null> {
    const { email } = body;

    const user = await this.userTable.findOne({
      where: {
        email,
      },
    });

    return user;
  }

  async registration(
    @Body() body: createUserDto,
    @Headers('user-agent') userAgent: string,
  ): Promise<IAuthResult> {
    const { password, email } = body;
    const { jwtEncryptionKey, tokenExpire } = variables;
    const existingUser = await this.getUser(body);

    if (Boolean(existingUser)) {
      throw new BadRequestException('User already exist');
    }

    const hashOfPassword = await bcrypt.hash(password, 10);

    const userCreateResult = await this.userTable.create({
      email,
      password: hashOfPassword,
    });

    const userId = userCreateResult.getDataValue('id');

    const token = jwt.sign({ email }, jwtEncryptionKey, {
      expiresIn: tokenExpire,
    });

    const device = getDevice(userAgent);

    if (!device) {
      throw new BadRequestException('Unknown device');
    }

    await this.tokenTable.create({
      idOfUser: userId,
      device: device,
      token: token,
    });

    return {
      email,
      token,
    };
  }

  async login(
    @Body() body: createUserDto,
    @Headers('user-agent') userAgent: string,
  ): Promise<IAuthResult> {
    const { password, email } = body;
    const { jwtEncryptionKey, tokenExpire } = variables;

    const user = await this.getUser(body);

    if (!user) {
      throw new NotFoundException('User Not Found');
    }

    const isTruthPassword = await bcrypt.compare(
      password,
      user.getDataValue('password'),
    );

    if (!isTruthPassword) {
      throw new HttpException('Invalid Credentials', HttpStatus.UNAUTHORIZED);
    }

    const token = jwt.sign({ email }, jwtEncryptionKey, {
      expiresIn: tokenExpire,
    });

    const device = getDevice(userAgent);

    if (!device) {
      throw new BadRequestException('Unknown device');
    }

    const idOfUser = user.getDataValue('id');

    const existingToken = await this.tokenTable.findOne({
      where: {
        idOfUser,
        device,
      },
    });

    if (existingToken) {
      await existingToken.update({
        token,
      });
    } else {
      await this.tokenTable.create({
        idOfUser,
        device: device,
        token: token,
      });
    }

    return {
      token,
      email,
    };
  }

  async logout(token: string): Promise<IMessageResponse> {
    const existingToken = await this.tokenTable.findOne({
      where: {
        token,
      },
    });

    if (!existingToken) {
      throw new BadRequestException('Incorrect token');
    }

    await existingToken.destroy();

    return {
      message: 'User logouted',
    };
  }

  async removeUser(email: string) {
    const user = await this.userTable.findOne({
      where: {
        email,
      },
    });

    await user.destroy();
  }
}

export default AuthService;
