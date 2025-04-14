import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

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

export class CursorSearchQuery {
  @ApiPropertyOptional({
    description: '커서 포인트',
    example: 1,
    nullable: true,
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  cursor: number;

  @ApiProperty({ description: 'take size', example: 15 })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  size: number;
}
