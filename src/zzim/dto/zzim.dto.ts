import { ApiProperty } from '@nestjs/swagger';

export class ZzimItemResponseDto {
  @ApiProperty({ description: 'Zzim Unique Key', example: 284 })
  id: number;

  @ApiProperty({ description: 'Zzim Product Name', example: 'product_0' })
  name: string;

  @ApiProperty({ description: 'Zzim Product Price', example: 140500 })
  price: number;

  @ApiProperty({
    description: 'Zzim Product thumbnail',
    example: 'https://image.com/products/thumbnail/product_0.jpeg',
  })
  thumbnail: string;

  @ApiProperty({ description: 'User Unique key', example: 1 })
  user_id: number;

  @ApiProperty({ description: 'Product Unique key', example: 1 })
  product_id: number;

  @ApiProperty({ description: 'Drawer Unique key', example: 414 })
  drawer_id: number;

  @ApiProperty({
    description: 'Zzim created_at',
    example: '2025-04-13T14:22:33.987Z',
  })
  created_at: string;

  @ApiProperty({
    description: 'Zzim updated_at',
    example: '2025-04-13T14:22:33.987Z',
  })
  updated_at: string;
}
