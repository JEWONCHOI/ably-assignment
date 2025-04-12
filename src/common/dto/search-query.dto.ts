import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class SearchQuery {
  @ApiProperty({ description: '데이터를 조회할 페이지', example: 3 })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  page: number;

  @ApiProperty({ description: '데이터를 조회할 사이즈', example: 15 })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  size: number;
}
