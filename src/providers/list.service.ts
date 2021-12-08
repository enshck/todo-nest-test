import {
  Injectable,
  Req,
  InternalServerErrorException,
  NotFoundException,
  Body,
  BadRequestException,
  Inject,
} from '@nestjs/common';

import Todo from 'models/Todo';
import User from 'models/User';
import { dbTables } from 'const/dbTables';
import { IGetListResult } from 'interfaces/todoList';
import CreateElementDto from 'dto/createElement.dto';
import { IMessageResponse } from 'interfaces/common';
import { ICreatedElementResult } from 'controllers/list.controller';

@Injectable()
class ListService {
  constructor(
    @Inject(dbTables.USER_TABLE) private userTable: typeof User,
    @Inject(dbTables.TODO_TABLE)
    private todoTable: typeof Todo,
  ) {}
  async getList(@Req() req): Promise<IGetListResult> {
    const userId = req?.userId;

    if (!userId) {
      throw new InternalServerErrorException('User doesnt provided');
    }

    const listOfUsers: any = await this.todoTable.findAll({
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

    const todo = await this.todoTable.create({
      idOfUser: userId,
      value,
      scheduleAt,
    });

    const user = await this.userTable.findOne({
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

    const element = await this.todoTable.findOne({
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

    const element = await this.todoTable.findOne({
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
