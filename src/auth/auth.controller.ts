import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: any) {
    const token = await this.authService.login(loginDto);
    res.json({ token });
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    console.log(await this.authService.register(registerDto));
    return { message: 'Registration successful' };
  }

  @Get('confirm-account/:email/:token')
  async confirmAccount(@Param('email') email: string, @Param('token') token: string): Promise<string> {

    return `Cuenta confirmada para ${email} con el token ${token}`;
  }

  // @Post('forgot-password')
  // async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
  //   await this.authService.forgotPassword(forgotPasswordDto);
  //   return { message: 'Password reset instructions sent' };
  // }
  //
  // @Post('reset-password')
  // async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
  //   await this.authService.resetPassword(resetPasswordDto);
  //   return { message: 'Password reset successful' };
  // }
  //

}
