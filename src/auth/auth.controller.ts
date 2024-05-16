import { Body, Controller, HttpStatus, Param, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: any) {
    const token = await this.authService.login(loginDto);
    res.status(HttpStatus.ACCEPTED).json(token);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  @Post('confirm-account/:email/:token')
  async confirmAccount(
    @Param('email') email: string,
    @Param('token') activation_token: string,
    @Res() res: any,
  ) {
    const token = await this.authService.confirmAccount(
      email,
      activation_token,
    );

    return res.json(token);
  }

  @Post('forgot-password/:email/:token')
  async forgotPassword(@Body() forgotPasswordDto: LoginDto) {
    // await this.authService.forgotPassword(forgotPasswordDto);
    return { message: 'Password reset instructions sent' };
  }
}
