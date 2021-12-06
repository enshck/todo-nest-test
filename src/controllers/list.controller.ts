import {
  Controller,
  Body,
  Get,
  UseGuards,
  Post,
  Put,
  Req,
  Delete,
  Query,
  UsePipes,
} from '@nestjs/common';
import moment = require('moment');

import { controllerPaths, listPaths } from 'const/routes';
import AuthGuard from 'guards/auth.guard';
import ListService from 'providers/list.service';
import { BullService } from 'providers/bull.service';
import { IGetListResult } from 'interfaces/todoList';
import CreateElementDto from 'dto/createElement.dto';
import { IMessageResponse } from 'interfaces/common';
import { createElementSchema, updateElementSchema } from 'validation/todoList';
import JoiValidationPipe from 'pipes/joiValidation.pipe';

export interface ICreatedElementResult {
  userEmail: string;
  todoId: string;
  scheduleAt: string;
}

@Controller(controllerPaths.LIST)
class ListController {
  constructor(
    private readonly listService: ListService,
    private readonly bullService: BullService,
  ) {}

  @Get(listPaths.GET_LIST)
  @UseGuards(AuthGuard)
  async getList(@Req() req): Promise<IGetListResult> {
    return this.listService.getList(req);
  }

  @Post(listPaths.CREATE_ELEMENT)
  @UseGuards(AuthGuard)
  @UsePipes(new JoiValidationPipe(createElementSchema))
  async createElement(
    @Req() req,
    @Body() body: CreateElementDto,
  ): Promise<IMessageResponse> {
    const { scheduleAt, todoId, userEmail } =
      await this.listService.createElement(req, body);

    const isSameDate = moment(scheduleAt).isSame(moment(), 'date');

    if (isSameDate) {
      await this.bullService.createJob(userEmail, todoId, scheduleAt);
    }

    return {
      message: 'Element created',
    };
  }

  @Put(listPaths.UPDATE_ELEMENT)
  @UseGuards(AuthGuard)
  @UsePipes(new JoiValidationPipe(updateElementSchema))
  async updateElement(
    @Req() req,
    @Body() body: CreateElementDto,
  ): Promise<IMessageResponse> {
    const { scheduleAt, todoId, userEmail } =
      await this.listService.updateElement(req, body);

    const isSameDate = moment(scheduleAt).isSame(moment(), 'date');

    if (isSameDate) {
      await this.bullService.updateJob(userEmail, todoId, scheduleAt);
    }

    return {
      message: 'Element updated',
    };
  }

  @Delete(listPaths.DELETE_ELEMENT)
  @UseGuards(AuthGuard)
  async deleteElement(
    @Req() req,
    @Query('id') id: string,
  ): Promise<IMessageResponse> {
    await this.listService.deleteElement(req, id);
    await this.bullService.deleteJob(id);
    return {
      message: 'Element deleted',
    };
  }
}

export default ListController;
