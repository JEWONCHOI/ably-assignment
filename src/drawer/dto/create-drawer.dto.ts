import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateDrawerDto {
  @ApiProperty({ description: 'drawer name', example: '케이스' })
  @IsString()
  name: string;
}

export class CreateDrawerResponse {
  @ApiProperty({ description: 'Drawer Unique Key', example: 1 })
  id: number;

  @ApiProperty({ description: 'drawer name', example: '케이스' })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Drawer thumbnail images',
    example: 'https://image.com/products/thumbnail/product_0.jpeg,140500',
  })
  thumbnails: string[];
}
