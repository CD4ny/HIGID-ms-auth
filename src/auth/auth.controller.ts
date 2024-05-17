import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetDto } from './dto/reset.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

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

  @Post('forgot-password')
  async forgotPassword(@Body() data: { email: string }) {
    return await this.authService.forgotPassword(data.email);
  }

  @Post('reset-password')
  async resetPassword(@Body() register: ResetDto) {
    return await this.authService.resetPassword(register);
  }

  @ApiOperation({ summary: 'UserInfo' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('info-user')
  async isUserLogged(@Headers('authorization') token: string) {
    return this.authService.isUserLogged(token);
  }
}
