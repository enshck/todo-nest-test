import {
  Injectable,
  Body,
  BadRequestException,
  Headers,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Model } from 'sequelize';
import bcrypt = require('bcrypt');
import jwt = require('jsonwebtoken');

import Tokens from 'models/Tokens';
import User from 'models/User';
import createUserDto from 'dto/createUserDto';
import variables from 'config/variables';
import { IAuthResult, IUserModel } from 'interfaces/auth';
import getDevice from 'utils/getDevice';

@Injectable()
class AuthService {
  private async getUser(
    @Body() body: createUserDto,
  ): Promise<Model<IUserModel> | null> {
    const { userName } = body;

    const user = await User.findOne({
      where: {
        userName,
      },
    });

    return user;
  }

  async registration(
    @Body() body: createUserDto,
    @Headers('user-agent') userAgent: string,
  ): Promise<IAuthResult> {
    const { password, userName } = body;
    const { jwtEncryptionKey, tokenExpire } = variables;
    const existingUser = await this.getUser(body);

    if (Boolean(existingUser)) {
      throw new BadRequestException('User already exist');
    }

    const hashOfPassword = await bcrypt.hash(password, 10);

    const userCreateResult = await User.create({
      userName,
      password: hashOfPassword,
    });

    const userId = userCreateResult.getDataValue('id');

    const token = jwt.sign({ userName }, jwtEncryptionKey, {
      expiresIn: tokenExpire,
    });

    const device = getDevice(userAgent);

    if (!device) {
      throw new BadRequestException('Unknown device');
    }

    await Tokens.create({
      idOfUser: userId,
      device: device,
      token: token,
    });

    return {
      userName,
      token,
    };
  }

  async login(
    @Body() body: createUserDto,
    @Headers('user-agent') userAgent: string,
  ): Promise<IAuthResult> {
    const { password, userName } = body;
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

    const token = jwt.sign({ userName }, jwtEncryptionKey, {
      expiresIn: tokenExpire,
    });

    const device = getDevice(userAgent);

    if (!device) {
      throw new BadRequestException('Unknown device');
    }

    const idOfUser = user.getDataValue('id');

    const existingToken = await Tokens.findOne({
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
      await Tokens.create({
        idOfUser,
        device: device,
        token: token,
      });
    }

    return {
      token,
      userName,
    };
  }

  async logout(token: string): Promise<string> {
    const existingToken = await Tokens.findOne({
      where: {
        token,
      },
    });

    if (!existingToken) {
      throw new BadRequestException('Incorrect token');
    }

    await existingToken.destroy();

    return 'User logouted';
  }
}

export default AuthService;
