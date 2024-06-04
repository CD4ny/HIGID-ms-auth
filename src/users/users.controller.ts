import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  UnauthorizedException,
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

  private extractToken(payload: string): string | undefined {
    const token = payload.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException();
    }

    return token;
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Headers('authorization') token: string) {
    return this.usersService.findOne(id, this.extractToken(token));
  }

  @UseGuards(AuthGuard)
  @Patch()
  update(
    @Body() updateUserDto: UpdateUserDto,
    @Headers('authorization') token: string,
  ) {
    return this.usersService.update(updateUserDto, this.extractToken(token));
  }

  @UseGuards(AuthGuard)
  @Delete()
  remove(@Headers('authorization') token: string) {
    return this.usersService.delete(this.extractToken(token));
  }
}
