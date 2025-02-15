import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Request,
  UseGuards,
  HttpException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ChangePasswordRequestDto,
  LoginRequestDto,
  LogoutRequestDto,
  RefreshTokenRequestDto,
  RegisterRequestDto,
} from '../../dto/request.dto';

import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UnauthorizedException } from '@nestjs/common';
import { JwtAuthGuard } from 'src/endpoints/auth/jwt-auth.guard';
import {
  AuthResponseDto,
  ChangePasswordResponseDto,
} from 'src/dto/response.dto';
import { UserDto } from 'src/dto/data.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({
    status: 200,
    description: 'Returns access token',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiBody({ type: LoginRequestDto })
  async login(@Request() req, @Body() loginDto: LoginRequestDto) {
    if (req.user) {
      throw new HttpException('User already logged in', HttpStatus.BAD_REQUEST);
    }
    return this.authService.login(loginDto);
  }

  @Post('register')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({
    status: 200,
    description: 'User registered',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 400, description: 'User already exists' })
  @ApiBody({ type: RegisterRequestDto })
  async register(@Request() req, @Body() registerDto: RegisterRequestDto) {
    if (req.user) {
      throw new HttpException('User already logged in', HttpStatus.BAD_REQUEST);
    }
    return this.authService.register(registerDto);
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get current user' })
  @ApiResponse({
    status: 200,
    description: 'Returns current user',
    type: UserDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async me(@Request() req) {
    var userId = req.user.id;
    return this.authService.getUserById(userId);
  }

  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Change password' })
  @ApiResponse({
    status: 200,
    description: 'User password changed',
    type: ChangePasswordResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'User password not changed',
    type: ChangePasswordResponseDto,
  })
  @ApiBody({ type: ChangePasswordRequestDto })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async changePassword(@Request() req, @Body() body: ChangePasswordRequestDto) {
    var userId = req.user.id;
    return this.authService.changePassword(userId, body);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'User logout removes refresh token from availability',
  })
  @ApiResponse({ status: 200, description: 'User logged out' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async logout(@Body() data: LogoutRequestDto) {
    //TODO: can require authentication to call this maybe
    return this.authService.logout(data.refreshToken);
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh token' })
  @ApiResponse({
    status: 200,
    description: 'Returns new access token',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({ type: RefreshTokenRequestDto })
  async refreshToken(@Body() data: RefreshTokenRequestDto) {
    return this.authService.refreshToken(data.refreshToken);
  }
}
