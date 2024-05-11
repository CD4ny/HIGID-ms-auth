import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async login(loginDto: LoginDto) {}

  async register(data: RegisterDto) {
    const user :RegisterDto = await this.prisma.user.create({
      data
    });
    return user.id
  }

  // async confirmAccount(confirmAccountDto: ConfirmAccountDto) {}
  //
  // async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {}
  //
  // async resetPassword(resetPasswordDto: ResetPasswordDto) {}
}
