import { ApiProperty } from '@nestjs/swagger';

export class GetMyDrawerByNameDto {
  @ApiProperty({ description: 'Drawer Name', example: '케이스' })
  name: string;

  @ApiProperty({ description: 'User Unique Key', example: 1 })
  user_id: number;
}
