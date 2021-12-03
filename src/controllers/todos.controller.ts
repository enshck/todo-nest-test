import { Controller, Body, Headers, Get, UseGuards } from '@nestjs/common';

import AuthService from 'providers/auth.service';
import { controllerPaths, listPaths } from 'const/routes';
import { registrationSchema } from 'validation/auth';
import JoiValidationPipe from 'pipes/joiValidation.pipe';
import createUserDto from 'dto/createUserDto';
import { IAuthResult } from 'interfaces/auth';
import AuthGuard from 'guards/auth.guard';

@Controller(controllerPaths.LIST)
class TodoController {
  constructor(private readonly authService: AuthService) {}

  @Get(listPaths.GET_LIST)
  @UseGuards(AuthGuard)
  async registration(
    @Body() body: createUserDto,
    @Headers('user-agent') userAgent: string,
  ): Promise<IAuthResult> {
    return this.authService.registration(body, userAgent);
  }
}

export default TodoController;
