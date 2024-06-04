import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async findOne(id: string, token: string) {
    const payload = this.jwtService.decode(token);
    const id_aux = payload.id;
    const user = await this.prisma.user.findUnique({ where: { id: id_aux } });

    if (!user) {
      throw new HttpException(
        'El usuario no existe, por favor registrarse en el sistema',
        HttpStatus.NOT_FOUND,
      );
    }

    if (user.token !== token || !user.active) {
      throw new HttpException(
        'El usuario no esta autenticado',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findOneByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  async update(id: string, data: UpdateUserDto, token: string) {
    const payload = this.jwtService.decode(token);
    const id_aux = payload.id;
    const user = await this.prisma.user.findUnique({ where: { id: id_aux } });

    if (!user) {
      throw new HttpException(
        'El usuario no existe, por favor registrarse en el sistema',
        HttpStatus.NOT_FOUND,
      );
    }

    if (user.token !== token || !user.active) {
      throw new HttpException(
        'El usuario no esta autenticado',
        HttpStatus.BAD_REQUEST,
      );
    }

    const { name, surname, fileChanged, filePath } = data;

    const newData = { name, surname };

    if (!filePath && fileChanged === 'true') newData['picture'] = null;
    else if (filePath) newData['picture'] = filePath;

    return this.prisma.user.update({
      where: { id },
      data: newData,
    });
  }

  async delete(id: string, token: string) {
    const payload = this.jwtService.decode(token);
    const id_aux = payload.id;
    const user = await this.prisma.user.findUnique({ where: { id: id_aux } });

    if (!user) {
      throw new HttpException(
        'El usuario no existe, por favor registrarse en el sistema',
        HttpStatus.NOT_FOUND,
      );
    }

    if (user.token !== token || !user.active) {
      throw new HttpException(
        'El usuario no esta autenticado',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.prisma.user.update({
      where: { id },
      data: { active: false },
    });
  }
}
