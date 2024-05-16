import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email of the user',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'John Doe', description: 'The name of the user' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'Doe', description: 'The surname of the user' })
  @IsOptional()
  @IsString()
  surname?: string;

  @ApiProperty({
    example: 'https://example.com/picture.jpg',
    description: 'The picture URL of the user',
  })
  @IsOptional()
  @IsString()
  picture?: string;

  @ApiProperty({
    example: 'token123',
    description: 'The authentication token of the user',
  })
  @IsOptional()
  @IsString()
  token?: string;

  @ApiProperty({
    example: 'password123',
    description: 'The password of the user',
  })
  @IsOptional()
  @IsString()
  password?: string;
}
