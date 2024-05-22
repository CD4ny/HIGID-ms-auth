import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
// import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      request['user'] = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
    } catch (error) {
      if (error.name === 'TokenExpiredError') throw new ForbiddenException();
      throw new UnauthorizedException();
    }
    return true;
  }

  public extractTokenFromHeader(request: string): string | undefined {
    const [type, token] = request?.split(' ') ?? [];
    //console.log(request.headers);
    return type === 'Bearer' ? token : undefined;
  }
}
