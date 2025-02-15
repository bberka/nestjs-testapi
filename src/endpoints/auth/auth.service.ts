import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service'; // Make sure you have PrismaService
import {
  ChangePasswordRequestDto,
  LoginRequestDto,
  RegisterRequestDto,
} from '../../dto/request.dto';
import * as hash from 'src/utils/hash.util';
import { User } from '@prisma/client';
import { AuthResponseDto } from 'src/dto/response.dto';
import { UserDto } from 'src/dto/data.dto';
import { plainToInstance } from 'class-transformer';
import { isFirebasePushId } from 'class-validator';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}

  async getJwtSecret(): Promise<string> {
    return (
      process.env.JWT_SECRET || (await hash.hashPassword('your-secret-key'))
    );
  }

  async _jwtSignIn(user: User): Promise<AuthResponseDto> {
    const refreshToken = await hash.generateRefreshToken();
    const expireDate = new Date();
    expireDate.setMinutes(
      expireDate.getMinutes() +
        parseInt(process.env.REFRESH_TOKEN_EXPIRE_MINUTES || '5'),
    );
    const newRTokenEntity = await this.prismaService.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: expireDate,
      },
    });

    const payload = {
      sub: user.id,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      email: user.email,
      refreshToken: newRTokenEntity.token,
      refreshTokenExpiresAt: newRTokenEntity.expiresAt,
    };

    const accessLiveMin = process.env.JWT_EXPIRE_MINUTES || '5';
    const accessExpireDate = new Date();
    accessExpireDate.setMinutes(
      accessExpireDate.getMinutes() + parseInt(accessLiveMin),
    );

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: accessLiveMin + 'm',
      secret: await this.getJwtSecret(),
    });

    return new AuthResponseDto(
      accessToken,
      newRTokenEntity.token,
      newRTokenEntity.expiresAt,
      accessExpireDate,
    );
  }

  async login(loginDto: LoginRequestDto): Promise<AuthResponseDto> {
    const email = loginDto.email;
    const password = loginDto.password;
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    const hashPassword = await hash.hashPassword(password);
    if (!user) {
      throw new HttpException('Invalid credentials', 400);
    }

    const isPasswordValid = hashPassword === user.passwordHash;
    if (!isPasswordValid) {
      throw new HttpException('Invalid credentials', 400);
    }

    return this._jwtSignIn(user);
  }

  async register(registerDto: RegisterRequestDto): Promise<AuthResponseDto> {
    const email = registerDto.email;
    const password = registerDto.password;
    const passwordRepeat = registerDto.passwordRepeat;
    const isPasswordsMatch = password === passwordRepeat;
    if (!isPasswordsMatch) {
      throw new HttpException('Passwords do not match', 400);
    }

    const existingUser = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new HttpException('User already exists', 400);
    }

    const passwordHash = await hash.hashPassword(password);
    const user = await this.prismaService.user.create({
      data: {
        email,
        passwordHash,
      },
    });

    return this._jwtSignIn(user);
  }

  async getUserById(id: string): Promise<UserDto> {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new UnauthorizedException();
      }
      return plainToInstance(UserDto, user, { excludeExtraneousValues: true });
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  async changePassword(userId: string, body: ChangePasswordRequestDto) {
    const oldPassword = body.oldPassword;
    const newPassword = body.newPassword;
    const newPasswordRepeat = body.newPasswordRepeat;

    const isNewPasswordMatch = newPassword === newPasswordRepeat;
    if (!isNewPasswordMatch) {
      throw new HttpException('Passwords do not match', 400);
    }
    const isOldPasswordEqualToNew = oldPassword === newPassword;
    if (isOldPasswordEqualToNew) {
      throw new HttpException('Old and new passwords are the same', 400);
    }
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new HttpException('User not found', 400);
    }

    const oldPasswordHash = await hash.hashPassword(oldPassword);
    const isOldPasswordMatch = user.passwordHash === oldPasswordHash;
    if (!isOldPasswordMatch) {
      throw new HttpException('Invalid old password', 400);
    }

    const newPasswordHash = await hash.hashPassword(newPassword);
    await this.prismaService.user.update({
      where: { id: userId },
      data: { passwordHash: newPasswordHash, updatedAt: new Date() },
    });

    await this.prismaService.passwordChangeLog.create({
      data: {
        userId,
        oldPasswordHash: oldPasswordHash,
        newPasswordHash: newPasswordHash,
      },
    });

    return { message: 'Password changed' };
  }

  async logout(refreshToken: string) {
    //Result is ALWAYS going to be 1, because we are deleting by token and userId
    await this.prismaService.refreshToken.deleteMany({
      where: { token: refreshToken },
    });

    return { message: 'Logged out' };
  }

  async refreshToken(refreshToken: string): Promise<AuthResponseDto> {
    const refreshTokenEntity = await this.prismaService.refreshToken.findFirst({
      where: { token: refreshToken },
    });

    if (!refreshTokenEntity) {
      throw new UnauthorizedException();
    }

    const user = await this.prismaService.user.findUnique({
      where: { id: refreshTokenEntity.userId },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    const removeResult = await this.prismaService.refreshToken.deleteMany({
      where: { token: refreshToken },
    });

    return this._jwtSignIn(user);
  }
}
