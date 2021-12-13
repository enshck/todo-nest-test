import { Controller, Post, UsePipes, Body, Headers, Get } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiProperty,
  ApiHeader,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

import AuthService from 'providers/auth.service';
import { controllerPaths, authPaths } from 'const/routes';
import { registrationSchema } from 'validation/auth';
import JoiValidationPipe from 'pipes/joiValidation.pipe';
import createUserDto from 'dto/createUser.dto';
import { IAuthResult } from 'interfaces/auth';
import { IMessageResponse, MessageResponse } from 'interfaces/common';

class LoginResponse {
  @ApiProperty()
  token: string;

  @ApiProperty()
  email: string;
}

// SWAGGER
@ApiBearerAuth()
@ApiTags('Authorization')
// SWAGGER
@Controller(controllerPaths.AUTH)
class AuthController {
  constructor(private readonly authService: AuthService) {}

  // SWAGGER
  @ApiOperation({ summary: 'Registration' })
  @ApiOkResponse({
    type: LoginResponse,
    description: 'Sign up',
  })
  @ApiBadRequestResponse({ description: 'User already exist' })
  @ApiInternalServerErrorResponse({ description: 'Internal server Error' })
  // SWAGGER
  @Post(authPaths.REGISTRATION)
  @UsePipes(new JoiValidationPipe(registrationSchema))
  async registration(
    @Body() body: createUserDto,
    @Headers('user-agent') userAgent: string,
  ): Promise<IAuthResult> {
    return this.authService.registration(body, userAgent);
  }

  // SWAGGER
  @ApiOperation({ summary: 'Login' })
  @ApiOkResponse({
    type: LoginResponse,
    description: 'Successful login',
  })
  @ApiBadRequestResponse({ description: 'Unknown device' })
  @ApiUnauthorizedResponse({ description: 'Invalid Credentials' })
  @ApiNotFoundResponse({ description: 'User Not Found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server Error' })
  // SWAGGER
  @Post(authPaths.LOGIN)
  @UsePipes(new JoiValidationPipe(registrationSchema))
  async login(
    @Body() body: createUserDto,
    @Headers('user-agent') userAgent: string,
  ): Promise<IAuthResult> {
    return this.authService.login(body, userAgent);
  }

  // SWAGGER
  @ApiOperation({ summary: 'Logout' })
  @ApiHeader({
    name: 'user-agent',
    description: 'For device definition',
    required: true,
  })
  @ApiOkResponse({
    description: 'User logouted',
    type: MessageResponse,
  })
  @ApiBadRequestResponse({ description: 'Incorrect token' })
  @ApiInternalServerErrorResponse({ description: 'Internal server Error' })
  // SWAGGER
  @Get(authPaths.LOGOUT)
  async logout(
    @Headers('authorization') token: string,
  ): Promise<IMessageResponse> {
    return this.authService.logout(token);
  }
}

export default AuthController;
