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
  Patch,
} from '@nestjs/common';
import moment = require('moment');
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiProperty,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiHeader,
  ApiQuery,
} from '@nestjs/swagger';

import { controllerPaths, listPaths } from 'const/routes';
import AuthGuard from 'guards/auth.guard';
import ListService from 'providers/list.service';
import { BullService } from 'providers/bull.service';
import { IGetListResult } from 'interfaces/todoList';
import CreateElementDto from 'dto/createElement.dto';
import { IMessageResponse, MessageResponse } from 'interfaces/common';
import { createElementSchema, updateElementSchema } from 'validation/todoList';
import JoiValidationPipe from 'pipes/joiValidation.pipe';

export interface ICreatedElementResult {
  userEmail: string;
  todoId: string;
  scheduleAt: string;
}

export interface ISwitchStatusResult {
  userEmail: string;
  newStatus: boolean;
  scheduleAt: string;
}
class TodoElement {
  @ApiProperty()
  id: string;

  @ApiProperty()
  value: string;

  @ApiProperty()
  scheduleAt: string;
}

class TodoElementsResult {
  @ApiProperty({
    type: [TodoElement],
  })
  data;
}
// SWAGGER
@ApiBearerAuth()
@ApiTags('Todo CRUD')
@ApiHeader({
  name: 'user-agent',
  description: 'For device definition',
  required: true,
})
@ApiHeader({
  name: 'authorization',
  description: 'JWT',
  required: true,
})
// SWAGGER
@Controller(controllerPaths.LIST)
class ListController {
  constructor(
    private readonly listService: ListService,
    private readonly bullService: BullService,
  ) {}

  // SWAGGER
  @ApiOperation({ summary: 'Get list of todo elements' })
  @ApiQuery({
    name: 'date',
    required: false,
    type: 'string',
  })
  @ApiOkResponse({
    type: TodoElementsResult,
  })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  // SWAGGER
  @Get(listPaths.GET_LIST)
  @UseGuards(AuthGuard)
  async getList(
    @Req() req,
    @Query('date') changedDate: string | undefined,
  ): Promise<IGetListResult> {
    return this.listService.getList(req, changedDate);
  }

  // SWAGGER
  @ApiOperation({ summary: 'Create Element' })
  @ApiCreatedResponse({
    description: 'Element Created',
    type: MessageResponse,
  })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  // SWAGGER
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

  // SWAGGER
  @ApiOperation({ summary: 'Update Element' })
  @ApiCreatedResponse({
    description: 'Element Updated',
    type: MessageResponse,
  })
  @ApiNotFoundResponse({ description: 'Element not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  // SWAGGER
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
    const isAfterCurrentMoment = moment(scheduleAt).isAfter(moment());

    if (isSameDate && isAfterCurrentMoment) {
      await this.bullService.updateJob(userEmail, todoId, scheduleAt);
    } else {
      await this.bullService.deleteJob(todoId);
    }

    return {
      message: 'Element updated',
    };
  }

  // SWAGGER
  @ApiOperation({ summary: 'Delete Element' })
  @ApiCreatedResponse({
    description: 'Element Deleted',
  })
  @ApiNotFoundResponse({ description: 'Element not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  // SWAGGER
  @Delete(listPaths.DELETE_ELEMENT)
  @UseGuards(AuthGuard)
  async deleteElement(
    @Req() req,
    @Query('id') id: string,
  ): Promise<IMessageResponse> {
    await this.listService.deleteElement(req, id);
    await this.bullService.deleteJob(id);
    return {
      message: 'Element Deleted',
    };
  }

  // SWAGGER
  @ApiOperation({ summary: 'Switch todo element status' })
  @ApiCreatedResponse({
    description: 'Status updated',
  })
  @ApiNotFoundResponse({ description: 'Element not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  // SWAGGER
  @Patch(listPaths.SWITCH_ELEMENT_STATUS)
  @UseGuards(AuthGuard)
  async switchElementStatus(
    @Req() req,
    @Query('id') id: string,
  ): Promise<IMessageResponse> {
    const { newStatus, scheduleAt, userEmail } =
      await this.listService.switchElementStatus(req, id);

    const isSameDate = moment(scheduleAt).isSame(moment(), 'date');

    if (!isSameDate) {
      return {
        message: 'Status Updated',
      };
    }

    if (newStatus) {
      await this.bullService.deleteJob(id);
    } else {
      await this.bullService.createJob(userEmail, id, scheduleAt);
    }

    return {
      message: 'Status Updated',
    };
  }
}

export default ListController;
