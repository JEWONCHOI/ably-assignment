import { ApiProperty } from '@nestjs/swagger';

export class ChangePaginationFormDto<T> {
  @ApiProperty({ description: '데이터 리스트' })
  data: T;
  @ApiProperty({ description: '전체 데이터 개수' })
  totalElement: number;
  @ApiProperty({ description: '데이터 take 개수' })
  take: number;
  @ApiProperty({ description: '페이지네이션 현재 페이지' })
  page: number;
  @ApiProperty({ description: '데이터 key name' })
  dataName: string;
}

export class ChangePaginationFormResponse<T> {
  @ApiProperty({ description: '전체 데이터 개수' })
  totalElement: number;

  @ApiProperty({ description: '전체 페이지 수' })
  totalPages: number;

  @ApiProperty({ description: '현재 조회중인 페이지' })
  currentPage: number;

  [key: string]: T | number;
}
