import { Test } from '@nestjs/testing';

import AuthController from 'controllers/auth.controller';
import AuthService from 'providers/auth.service';
import DBModule from 'modules/database.module';

import { IAuthResult } from 'interfaces/auth';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [DBModule],
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    authController = moduleRef.get<AuthController>(AuthController);
  });

  const email = 'testtesttest@gmail.com';
  const password = 'qweqweqwe';
  let registeredUser: IAuthResult | null = null;

  describe('authController-registration', () => {
    it('should return user token and email', async () => {
      const getUserAfterSignUp = async () => {
        registeredUser = await authService.registration(
          {
            email,
            password,
          },
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36',
        );

        return Object.keys(registeredUser).sort();
      };
      expect(await getUserAfterSignUp()).toEqual(['token', 'email'].sort());
    });
  });

  describe('authController-login', () => {
    it('should return user token and email', async () => {
      expect(
        Object.keys(
          await authController.login(
            {
              email,
              password,
            },
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36',
          ),
        ).sort(),
      ).toEqual(['token', 'email'].sort());
    });
  });

  describe('authController-logout', () => {
    it('should return succesfull message', async () => {
      expect(await authController.logout(registeredUser?.token)).toBe(
        'User logouted',
      );

      await authService.removeUser(email);
    });
  });
});
