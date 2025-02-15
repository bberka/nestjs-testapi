import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthService } from './endpoints/auth/auth.service';
import { AuthController } from './endpoints/auth/auth.controller';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service';
import { JwtStrategy } from './endpoints/auth/jwt.strategy';
import { JwtAuthGuard } from './endpoints/auth/jwt-auth.guard';

@Module({
  imports: [],
  controllers: [AppController, AuthController],
  providers: [
    AppService,
    AuthService,
    JwtService,
    PrismaService,
    JwtStrategy,
    JwtAuthGuard,
  ],
})
export class AppModule {}
