import { Controller, Post, UsePipes, Body, Headers, Get } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiProperty,
  ApiHeader,
} from '@nestjs/swagger';

import AuthService from 'providers/auth.service';
import { controllerPaths, authPaths } from 'const/routes';
import { registrationSchema } from 'validation/auth';
import JoiValidationPipe from 'pipes/joiValidation.pipe';
import createUserDto from 'dto/createUser.dto';
import { IAuthResult } from 'interfaces/auth';

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
  @ApiResponse({
    status: 200,
    type: LoginResponse,
    description: 'Sign up',
  })
  @ApiResponse({ status: 400, description: 'User already exist' })
  @ApiResponse({ status: 500, description: 'Internal server Error' })
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
  @ApiResponse({
    status: 200,
    type: LoginResponse,
    description: 'Successful login',
  })
  @ApiResponse({ status: 400, description: 'Unknown device' })
  @ApiResponse({ status: 401, description: 'Invalid Credentials' })
  @ApiResponse({ status: 404, description: 'User Not Found' })
  @ApiResponse({ status: 500, description: 'Internal server Error' })
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
  @ApiResponse({
    status: 200,
    description: 'User logouted',
  })
  @ApiHeader({
    name: 'user-agent',
    description: 'For device definition',
    required: true,
  })
  @ApiResponse({ status: 400, description: 'Incorrect token' })
  @ApiResponse({ status: 500, description: 'Internal server Error' })
  // SWAGGER
  @Get(authPaths.LOGOUT)
  async logout(@Headers('authorization') token: string): Promise<string> {
    return this.authService.logout(token);
  }
}

export default AuthController;
