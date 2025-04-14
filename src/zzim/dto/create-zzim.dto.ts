import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateZzimDto {
  @ApiProperty({ description: 'User Drawer ID', example: 1 })
  @IsNumber()
  drawer_id: number;
}

export class CreateZzimResponse {
  @ApiProperty({ description: 'ZZIM Unique Key', example: 1 })
  id: number;

  @ApiProperty({ description: 'User Unique Key', example: 1 })
  user_id: number;

  @ApiProperty({ description: 'Drawer Unique Key', example: 1 })
  drawer_id: number;

  @ApiProperty({ description: 'Product Unique Key', example: 1 })
  product_id: number;
}
