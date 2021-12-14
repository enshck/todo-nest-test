import { Test } from '@nestjs/testing';
import { Sequelize } from 'sequelize-typescript';

import ListController from 'controllers/list.controller';
import AuthController from 'modules/auth.module';
import ListService from 'providers/list.service';
import BullModule from 'modules/bull.module';
import DBModule from 'modules/database.module';
import AuthService from 'providers/auth.service';

interface IUserModel {
  id: string;
  email: string;
  password: string;
}

export interface ICreatedTodoElementResult {
  userEmail: string;
  todoId: string;
  scheduleAt: string;
}

describe('ListContoller', () => {
  let listService: ListService;
  let sequelize: Sequelize;
  let user: IUserModel;
  let todoElement: ICreatedTodoElementResult;
  let authService: AuthService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [DBModule, BullModule],
      controllers: [ListController, AuthController],
      providers: [ListService, AuthService],
    }).compile();

    listService = moduleRef.get<ListService>(ListService);
    sequelize = moduleRef.get('SEQUELIZE');
    authService = moduleRef.get<AuthService>(AuthService);
  });

  const email = 'testtesttest@gmail.com';
  const password = 'qweqweqwe';

  it('creating new user...', async () => {
    await authService.registration(
      {
        email,
        password,
      },
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36',
    );

    user = (
      await sequelize.models.User.findOne({
        where: {
          email,
        },
      })
    ).get();
  });

  describe('listController-getList', () => {
    it('should return empty array of list elements', async () => {
      expect(
        await listService.getList({
          userId: user.id,
        }),
      ).toEqual({
        data: [],
      });
    });
  });

  describe('listController-createTodo', () => {
    it('should return new todo element', async () => {
      const getNewTodoElement = async () => {
        todoElement = await listService.createElement(
          {
            userId: user.id,
          },
          {
            value: 'Test todo element',
            scheduleAt: '2021-12-09 14:50:00.176+02',
            id: user.id,
          },
        );

        return Object.keys(todoElement).sort();
      };

      expect(await getNewTodoElement()).toEqual(
        ['userEmail', 'todoId', 'scheduleAt'].sort(),
      );
    });
  });

  describe('listController-update', () => {
    it('should return updated todo element', async () => {
      const getNewTodoElement = async () => {
        todoElement = await listService.updateElement(
          {
            userId: user.id,
          },
          {
            value: 'Test todo element',
            scheduleAt: '2021-12-09 14:50:00.176+02',
            id: todoElement.todoId,
          },
        );

        return Object.keys(todoElement).sort();
      };

      expect(await getNewTodoElement()).toEqual(
        ['userEmail', 'todoId', 'scheduleAt'].sort(),
      );
    });
  });

  describe('listController-switch-status', () => {
    it('should return new data with switched status', async () => {
      const getSwitchedElement = async () => {
        const result = await listService.switchElementStatus(
          {
            userId: user.id,
          },
          todoElement.todoId,
        );

        return Object.keys(result).sort();
      };

      expect(await getSwitchedElement()).toEqual(
        ['scheduleAt', 'newStatus', 'userEmail'].sort(),
      );
    });
  });

  describe('listController-remove', () => {
    it('should return successful message', async () => {
      expect(
        await listService.deleteElement(
          {
            userId: user.id,
          },
          todoElement.todoId,
        ),
      ).toEqual({
        message: 'Element deleted',
      });
    });
  });

  it('deleting test user...', async () => {
    await authService.removeUser(email);
  });
});
