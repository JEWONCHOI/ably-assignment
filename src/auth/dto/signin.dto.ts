import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class SigninDto {
  @ApiProperty({ description: 'User Email', example: 'test123@test.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'User Password', example: 'password123' })
  @IsString()
  password: string;
}

export class SigninResponse {
  @ApiProperty({
    description: 'JWT Acess Token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;
}
