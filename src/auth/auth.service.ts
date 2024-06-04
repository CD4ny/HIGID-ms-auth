import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

import { RegisterDto } from './dto/register.dto';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import {
  generateConfirmAccountEmail,
  generateForgotPasswordEmail,
} from './utils';
import { generateToken } from 'src/utils/token';
import { sendEmail } from 'src/utils/email';
import { ResetDto } from './dto/reset.dto';
import { AuthGuard } from './auth.guard';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private usersService: UsersService,
    private authGuard: AuthGuard,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findOneByEmail(loginDto.email);
    if (!user || !user.active)
      throw new HttpException(
        'El usuario no existe o la contraseña es incorrecta.',
        HttpStatus.NOT_FOUND,
      );

    const match = await bcrypt.compare(loginDto.password, user.password);

    if (!match) {
      throw new HttpException(
        'El usuario no existe o la contraseña es incorrecta.',
        HttpStatus.NOT_FOUND,
      );
    }

    if (!user?.confirmed) {
      throw new HttpException('Cuenta sin confirmar.', HttpStatus.CONFLICT);
    }

    const payload = { id: user.id };

    const accessToken = await this.jwtService.signAsync(payload);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { token: accessToken },
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      surname: user.surname,
      accessToken,
      picture: user.picture,
    };
  }

  async register(data: RegisterDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    data.token = generateToken(8);
    const salt = bcrypt.genSaltSync(10);
    data.password = bcrypt.hashSync(data.password, salt);

    if (user) {
      if (!user.confirmed || !user.active) {
        await this.prisma.user.update({
          where: { email: data.email },
          data: {
            token: data.token,
            active: true,
            confirmed: false,
            password: data.password,
          },
        });
      } else {
        throw new HttpException('El usuario existe', HttpStatus.BAD_REQUEST);
      }
    } else {
      if (!data.name || data.name == '') {
        data.name = data.email.split('@')[0];
      }

      await this.prisma.user.create({
        data,
      });
    }

    await sendEmail({
      name: 'HIGID',
      to: data.email,
      subject: 'Email de verificación',
      html: generateConfirmAccountEmail(
        process.env.FRONTEND_HOST +
          `/confirm-account?email=${data.email}&token=${data.token}`,
      ),
    });

    return {
      message:
        'Le hemos enviado un correo electrónico. Por favor, revise su bandeja de entrada y siga las instrucciones para confirmar su cuenta.',
    };
  }

  async confirmAccount(email: string, token: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user || !user?.active) {
      throw new HttpException(
        'El usuario no existe o no esta activo',
        HttpStatus.NOT_FOUND,
      );
    } else if (user?.confirmed) {
      throw new HttpException(
        'El usuario ya esta confirmado',
        HttpStatus.BAD_REQUEST,
      );
    } else if (user.token !== token) {
      throw new HttpException('El token es incorrecto', HttpStatus.BAD_REQUEST);
    } else {
      return this.prisma.user.update({
        where: { email: email },
        data: { token: null, confirmed: true },
      });
    }
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    const token = generateToken(8);

    if (!user || !user.active || !user.confirmed) {
      throw new HttpException(
        'El usuario no existe, por favor registrarse en el sistema',
        HttpStatus.NOT_FOUND,
      );
    } else {
      await this.prisma.user.update({
        where: { email },
        data: { token },
      });
    }

    await sendEmail({
      name: 'HIGID Seguridad',
      to: email,
      subject: 'Email de restablecimiento de contraseña',
      html: generateForgotPasswordEmail(
        process.env.FRONTEND_HOST +
          `/forgot-password?email=${email}&token=${token}`,
      ),
    });

    return {
      message:
        'Le hemos enviado un correo electrónico. Por favor, revise su bandeja de entrada y siga las instrucciones para restablecer su contraseña.',
    };
  }

  async resetPassword(data: ResetDto) {
    const { email, token, password } = data;

    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user || !user.active || !user.confirmed) {
      throw new HttpException(
        'El usuario no existe, por favor registrarse en el sistema',
        HttpStatus.NOT_FOUND,
      );
    } else if (user.token !== token) {
      throw new HttpException('El token es incorrecto', HttpStatus.BAD_REQUEST);
    } else {
      const salt = bcrypt.genSaltSync(10);

      const newPassword = bcrypt.hashSync(password, salt);

      return this.prisma.user.update({
        where: { email: email },
        data: { token: null, password: newPassword },
      });
    }
  }

  async logout(req: string): Promise<{ message: string }> {
    const token = this.authGuard.extractTokenFromHeader(req);

    const payload = await this.jwtService.decode(token);
    const id = payload.id;
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new HttpException(
        'El usuario no existe, por favor registrarse en el sistema',
        HttpStatus.NOT_FOUND,
      );
    }

    if (user.token !== token || user.token === null) {
      throw new HttpException(
        'El usuario no esta autenticado',
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.prisma.user.update({
      where: { id },
      data: { token: null },
    });

    return { message: 'El usuario ha cerrado la autenticación correctamente.' };
  }

  async isUserLogged(req: string) {
    const token = this.authGuard.extractTokenFromHeader(req);
    // const verify = this.jwtService.verify(token);

    const payload = this.jwtService.decode(token);
    const id = payload.id;
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user.active || !user.confirmed) {
      throw new HttpException('', HttpStatus.FORBIDDEN);
    }

    if (!user) {
      throw new HttpException(
        'El usuario no existe, por favor registrarse en el sistema',
        HttpStatus.NOT_FOUND,
      );
    }

    if (user.token !== token) {
      throw new HttpException(
        'El usuario no esta autenticado',
        HttpStatus.BAD_REQUEST,
      );
    }
    return {
      name: user.name,
      surname: user.surname,
      id: user.id,
      email: user.email,
      picture: user.picture,
    };
  }
}
