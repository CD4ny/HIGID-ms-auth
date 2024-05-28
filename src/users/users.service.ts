import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserDto) {
    return this.prisma.user.create({
      data,
    });
  }

  async findOne(id: string) {
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

  async update(id: string, data: UpdateUserDto) {
    const { name, surname, fileChanged, filePath } = data;

    const newData = { name, surname };

    if (!filePath && fileChanged === 'true') newData['picture'] = null;
    else if (filePath) newData['picture'] = filePath;

    return this.prisma.user.update({
      where: { id },
      data: newData,
    });
  }

  async delete(id: string) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
