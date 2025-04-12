import { ApiProperty } from '@nestjs/swagger';

export class SignAccessTokenDto {
  @ApiProperty({ description: 'User Primary Key', example: 1 })
  userId: number;
  @ApiProperty({ description: 'User Email', example: 'test123@test.com' })
  userEmail: string;
  @ApiProperty({ description: 'User Nickname', example: '제원' })
  userNickname: string;
}

export class SignAccessTokenResponse {
  @ApiProperty({
    description: 'JWT Acess Token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;
}
