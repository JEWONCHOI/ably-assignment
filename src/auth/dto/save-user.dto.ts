import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class SaveUserDto {
  @ApiProperty({ description: 'User Email', example: 'test123@test.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'User Password', example: 'password123' })
  @IsString()
  password: string;

  @ApiProperty({ description: 'User Nickname', example: '제원' })
  @IsString()
  nickname: string;
}
