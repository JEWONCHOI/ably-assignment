import { ApiProperty } from '@nestjs/swagger';
import { Column } from 'typeorm';

export class SaveZzimDto {
  @ApiProperty({ description: 'Product Uique Key', example: 1 })
  product_id: number;

  @ApiProperty({ description: 'Product Name', example: '아이폰16 케이스' })
  name: string;

  @ApiProperty({ description: 'Product Price', example: 45000 })
  price: number;

  @ApiProperty({
    description: 'Product Thumbnail Image',
    example: 'https://..',
  })
  thumbnail: string;

  @ApiProperty({ description: 'User Unique Key', example: 1 })
  user_id: number;

  @ApiProperty({ description: 'Drawer Unique Key', example: 1 })
  drawer_id: number;
}
