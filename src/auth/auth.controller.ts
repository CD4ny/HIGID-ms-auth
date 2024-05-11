import { Body, Controller, Post, Res } from '@nestjs/common';
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
  // @Post('confirm-account')
  // async confirmAccount(@Body() confirmAccountDto: ConfirmAccountDto) {
  //   await this.authService.confirmAccount(confirmAccountDto);
  //   return { message: 'Account confirmed successfully' };
  // }
}
