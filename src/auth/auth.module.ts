import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, UsersService, AuthGuard],
})
export class AuthModule {}
