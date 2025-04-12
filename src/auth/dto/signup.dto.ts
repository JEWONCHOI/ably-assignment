import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class SignupDto {
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

export class SignupResponse extends PickType(SignupDto, ['email', 'nickname']) {
  @ApiProperty({ description: 'User Primary Key', example: 1 })
  id: number;
}
