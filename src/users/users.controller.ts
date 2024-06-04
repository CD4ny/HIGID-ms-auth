import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('User')
@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard) @Get(':id') findOne(
    @Param('id') id: string,
    @Headers('authorization') token: string,
  ) {
    return this.usersService.findOne(id, token);
  }

  @UseGuards(AuthGuard) @Patch(':id') update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Headers('authorization') token: string,
  ) {
    return this.usersService.update(id, updateUserDto, token);
  }

  @UseGuards(AuthGuard) @Delete(':id') remove(
    @Param('id') id: string,
    @Headers('authorization') token: string,
  ) {
    return this.usersService.delete(id, token);
  }
}
