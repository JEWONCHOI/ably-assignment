import { ApiProperty } from '@nestjs/swagger';

const PAGINATION_EXAMPLE_DATA = [
  {
    id: 284,
    name: 'product_0',
    price: 140500,
    thumbnail: 'https://image.com/products/thumbnail/product_0.jpeg',
    user_id: 421,
    product_id: 1,
    drawer_id: 414,
    created_at: '2025-04-13T14:22:33.987Z',
    updated_at: '2025-04-13T14:22:33.987Z',
  },
];

export class ChangeCursorPagiFormDto<T extends { id: number }> {
  @ApiProperty({ description: '전체 데이터', example: PAGINATION_EXAMPLE_DATA })
  dataList: T[];

  @ApiProperty({ description: '전체 take size', example: 10 })
  size: number;
}
export class PaginationMeta {
  @ApiProperty({ description: '다음 페이지 커서', example: '2025...' })
  nextCursor: number | null;

  @ApiProperty({ description: '다음 페이지 여부', example: false })
  hasNext: boolean;

  @ApiProperty({ description: '전체 take size', example: false })
  size: number;
}

export class ChangeCursorPagiFormResponse<T extends { id: number }> {
  @ApiProperty({
    description: '전체 데이터 리스트',
    example: PAGINATION_EXAMPLE_DATA,
  })
  data: T[];

  @ApiProperty({
    description: '전체 take size',
    type: PaginationMeta,
    example: {
      nextCursor: '2025-04-13 23:22:33.987911',
      hasNext: false,
      size: 15,
    },
  })
  meta: PaginationMeta;
}
