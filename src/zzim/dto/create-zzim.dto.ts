import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateZzimDto {
  @ApiProperty({ description: 'User Drawer ID', example: 1 })
  @IsNumber()
  drawer_id: number;
}
