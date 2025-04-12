import { ApiProperty } from '@nestjs/swagger';

export class UserInfoResponse {
  @ApiProperty({ description: 'User Primary Key', example: 1 })
  id: number;

  @ApiProperty({ description: 'User Email', example: 'test123@test.com' })
  email: string;

  @ApiProperty({ description: 'User Nickname', example: '제원' })
  nickname: string;
}
