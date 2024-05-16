import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async generateToken(length: number) {
    return Math.random()
      .toString(36)
      .substring(2, length + 2);
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findOneByEmail(loginDto.email);
    const match = await bcrypt.compare(loginDto.password, user.password);

    if (!user || !match) {
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

    return { id: user.id, email: user.email, name: user.name, accessToken };
  }

  async register(data: RegisterDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (user) {
      throw new HttpException('El usuario existe', HttpStatus.BAD_REQUEST);
    }

    if (!data.name || data.name == '') {
      data.name = data.email.split('@')[0];
    }

    data.token = await this.generateToken(8);

    const salt = bcrypt.genSaltSync(10);
    data.password = bcrypt.hashSync(data.password, salt);

    await this.prisma.user.create({
      data,
    });

    const nodemailerOptions: SMTPTransport.Options = {
      service: 'gmail',
      host: process.env.MAIL_HOST,
      port: Number.parseInt(process.env.MAIL_PORT),
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    };

    const transporter = nodemailer.createTransport(nodemailerOptions);

    transporter
      .sendMail({
        from: {
          name: 'HIGID',
          address: process.env.MAIL_USER,
        },
        to: data.email,
        subject: 'Email de verificación',
        html: await this.generateEmailConfirmPage(
          process.env.HOST +
            `/auth/confirm-account/${data.email}/${data.token}`,
        ),
      })
      .then();
    return {
      message:
        'Le hemos enviado un correo electrónico. Por favor, revise su bandeja de entrada y siga las instrucciones para confirmar su cuenta.',
    };
  }

  async generateEmailConfirmPage(url: string) {
    return `<div>
              <h1>Confirmación de Correo Electrónico</h1>
              <p>
                Por favor, haz clic en el botón de abajo 
                para confirmar tu dirección de correo electrónico.
              </p>
              <a href="${url}"
              style="display:inline-block; padding:10px 20px; 
              background-color:#007BFF; color:#FFFFFF; 
              text-decoration:none; border-radius:5px;">
              Confirmar correo</a>
            </div>`;
  }

  async confirmAccount(email: string, token: string) {
    let user = await this.prisma.user.findUnique({ where: { email: email } });

    if (!user || (!user?.confirmed && user?.active) || user.token === token)
      throw new HttpException(
        'El usuario no existe o el token es incorrecto',
        HttpStatus.BAD_REQUEST,
      );
    else
      await this.prisma.user.update({
        where: { email: email },
        data: { token: null, active: true },
      });
    return this.login(user);
  }

  // async forgotPassword(forgotPasswordDto: LoginDto) {}
}
