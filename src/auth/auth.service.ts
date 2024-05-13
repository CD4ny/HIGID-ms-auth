import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findOneByEmail(loginDto.email);
    if (user?.password != loginDto.password) {
      throw new UnauthorizedException();
    }
    const payload = { id: user.id, name: user.name };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async register(data: RegisterDto) {
    const user: RegisterDto = await this.prisma.user.create({
      data,
    });
    return user.id;
  }

  // async confirmAccount(confirmAccountDto: ConfirmAccountDto) {}

  // async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {}

  // async resetPassword(resetPasswordDto: ResetPasswordDto) {}
}
