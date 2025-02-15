import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class LoginRequestDto {
  @ApiProperty({ example: 'user@example.com', description: 'User email' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', description: 'User password' })
  @IsString()
  @MinLength(6)
  password: string;
}

export class RegisterRequestDto {
  @ApiProperty({ example: 'user@example.com', description: 'User email' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', description: 'User password' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'password123', description: 'User password repeat' })
  @IsString()
  @MinLength(6)
  passwordRepeat: string;
}

export class ChangePasswordRequestDto {
  @ApiProperty({ example: 'password123', description: 'User old password' })
  @IsString()
  @MinLength(6)
  oldPassword: string;

  @ApiProperty({ example: 'password123', description: 'User new password' })
  @IsString()
  @MinLength(6)
  newPassword: string;

  @ApiProperty({
    example: 'password123',
    description: 'User new password repeat',
  })
  @IsString()
  @MinLength(6)
  newPasswordRepeat: string;
}

export class RefreshTokenRequestDto {
  @ApiProperty({ example: 'refresh_token', description: 'User refresh token' })
  @IsNotEmpty()
  @MinLength(64, { message: 'Refresh token is invalid' })
  refreshToken: string;
}

export class LogoutRequestDto {
  @ApiProperty({ example: 'refresh_token', description: 'User refresh token' })
  @IsNotEmpty()
  @MinLength(64, { message: 'Refresh token is invalid' })
  refreshToken: string;
}
