import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordResponseDto {
  constructor(message: string) {
    this.message = message;
  }
  @ApiProperty({ example: 'Password changed', description: 'Response message' })
  message: string;
}

export class AuthResponseDto {
  @ApiProperty({ example: 'access_token', description: 'User access token' })
  accessToken: string;

  @ApiProperty({
    example: '2021-01-01T00:00:00Z',
    description: 'Access token expiration date',
  })
  accessTokenExpiresAt: Date;

  @ApiProperty({ example: 'refresh_token', description: 'User refresh token' })
  refreshToken: string;

  @ApiProperty({
    example: '2021-01-01T00:00:00Z',
    description: 'Refresh token expiration date',
  })
  refreshTokenExpiresAt: Date;

  constructor(
    accessToken: string,
    refreshToken: string,
    refreshTokenExpiresAt: Date,
    accessTokenExpiresAt: Date,
  ) {
    this.accessToken = accessToken;
    this.accessTokenExpiresAt = accessTokenExpiresAt;
    this.refreshToken = refreshToken;
    this.refreshTokenExpiresAt = refreshTokenExpiresAt;
  }
}
