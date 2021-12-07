import {
  Injectable,
  Req,
  InternalServerErrorException,
  NotFoundException,
  Body,
  BadRequestException,
} from '@nestjs/common';

import Todos from 'models/Todos';
import { IGetListResult } from 'interfaces/todoList';
import CreateElementDto from 'dto/createElement.dto';
import { IMessageResponse } from 'interfaces/common';
import User from 'models/User';
import { ICreatedElementResult } from 'controllers/list.controller';

@Injectable()
class ListService {
  async getList(@Req() req): Promise<IGetListResult> {
    const userId = req?.userId;

    if (!userId) {
      throw new InternalServerErrorException('User doesnt provided');
    }

    const listOfUsers: any = await Todos.findAll({
      where: {
        idOfUser: userId,
      },
      attributes: ['id', 'value', 'scheduleAt'],
      order: ['id'],
    });

    return {
      data: listOfUsers,
    };
  }

  async createElement(
    @Req() req,
    @Body() body: CreateElementDto,
  ): Promise<ICreatedElementResult> {
    const userId = req?.userId;
    const { value, scheduleAt } = body;

    const todo = await Todos.create({
      idOfUser: userId,
      value,
      scheduleAt,
    });

    const user = await User.findOne({
      where: {
        id: userId,
      },
    });

    return {
      userEmail: user.getDataValue('email'),
      todoId: todo.getDataValue('id'),
      scheduleAt,
    };
  }

  async updateElement(
    @Req() req,
    @Body() body: CreateElementDto,
  ): Promise<ICreatedElementResult> {
    const userId = req?.userId;
    const { value, id, scheduleAt } = body;

    const element = await Todos.findOne({
      where: {
        idOfUser: userId,
        id,
      },
      include: ['User'],
    });

    if (!element) {
      throw new NotFoundException('Element not found');
    }

    await element.update({
      value,
      scheduleAt,
    });

    return {
      userEmail: element?.getDataValue('User')?.email,
      todoId: id,
      scheduleAt,
    };
  }

  async deleteElement(@Req() req, id: string): Promise<IMessageResponse> {
    const userId = req?.userId;

    if (!id) {
      throw new BadRequestException('id doesnt provided');
    }

    const element = await Todos.findOne({
      where: {
        idOfUser: userId,
        id,
      },
    });

    if (!element) {
      throw new NotFoundException('Element not found');
    }

    await element.destroy();

    return {
      message: 'Element deleted',
    };
  }
}

export default ListService;
