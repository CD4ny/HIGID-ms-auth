import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    const payload = this.jwtService.decode(token);

    const user = await this.prisma.user.findUnique({
      where: { id: payload.id },
    });

    if (!user.active || !user.confirmed) {
      throw new ForbiddenException();
    }

    if (!token || user.token !== token) {
      throw new UnauthorizedException();
    }
    try {
      await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
    } catch (error) {
      if (error.name === 'TokenExpiredError') throw new ForbiddenException();
      throw new UnauthorizedException();
    }
    return true;
  }

  public extractTokenFromHeader(request: Request | string): string | undefined {
    let type: string, token: string;

    if (typeof request === 'string') {
      [type, token] = request.split(' ') ?? [];
    } else {
      const authHeader = request.headers['authorization'];
      if (authHeader) {
        [type, token] = authHeader.split(' ') ?? [];
      }
    }
    return type === 'Bearer' ? token : undefined;
  }
}
