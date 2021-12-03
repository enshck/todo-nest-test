import { Controller, Post, UsePipes, Body, Headers, Get } from '@nestjs/common';

import AuthService from 'providers/auth.service';
import { controllerPaths, authPaths } from 'const/routes';
import { registrationSchema } from 'validation/auth';
import JoiValidationPipe from 'pipes/joiValidation.pipe';
import createUserDto from 'dto/createUserDto';
import { IAuthResult } from 'interfaces/auth';

@Controller(controllerPaths.AUTH)
class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(authPaths.REGISTRATION)
  @UsePipes(new JoiValidationPipe(registrationSchema))
  async registration(
    @Body() body: createUserDto,
    @Headers('user-agent') userAgent: string,
  ): Promise<IAuthResult> {
    return this.authService.registration(body, userAgent);
  }

  @Post(authPaths.LOGIN)
  @UsePipes(new JoiValidationPipe(registrationSchema))
  async login(
    @Body() body: createUserDto,
    @Headers('user-agent') userAgent: string,
  ): Promise<IAuthResult> {
    return this.authService.login(body, userAgent);
  }

  @Get(authPaths.LOGOUT)
  async logout(@Headers('authorization') token: string): Promise<string> {
    return this.authService.logout(token);
  }
}

export default AuthController;
