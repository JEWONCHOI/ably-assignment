import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SaveDrawerDto {
  @ApiProperty({ description: 'Drawer Name', example: '케이스' })
  name: string;

  @ApiProperty({ description: 'User Unique Key', example: 1 })
  userId: number;
}

export class SaveDrawerResponse {
  @ApiProperty({ description: 'Drawer Unique Key', example: 1 })
  id: number;

  @ApiProperty({ description: 'Drawer Name', example: '케이스' })
  name: string;

  @ApiProperty({
    description: 'Drawer thumbnail images',
    example: 'https://image.com/products/thumbnail/product_0.jpeg,140500',
  })
  thumbnails: string[];
}
