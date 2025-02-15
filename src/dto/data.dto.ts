import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Expose } from 'class-transformer';

export class UserDto {
  @ApiProperty({ example: 'cm75if2230000n2xxxxxx', description: 'User ID' })
  @Expose()
  id: string;

  @ApiProperty({
    example: '2021-01-01T00:00:00Z',
    description: 'User creation date',
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    example: '2021-01-01T00:00:00Z',
    description: 'User last update date',
  })
  @Expose()
  updatedAt: Date;

  @ApiProperty({ example: 'user@mail.com', description: 'User email' })
  @Expose()
  email: string;
}
