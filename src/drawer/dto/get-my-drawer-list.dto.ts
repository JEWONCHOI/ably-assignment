import { ApiProperty } from '@nestjs/swagger';

export class DrawerListItem {
  @ApiProperty({ description: 'Drawer Unique Key', example: 1 })
  id: number;
  @ApiProperty({ description: 'Drawer name', example: '케이스' })
  name: string;
  @ApiProperty({
    description: 'Drawer thubnail images',
    example: 'https://...',
  })
  thumbnails: string[] | [];
  @ApiProperty({ description: 'Drawer zzim counts', example: '3' })
  zzim_count: number;
  @ApiProperty({
    description: 'Drawer zzim counts',
    example: '2025-04-12 22:29:35.121576',
  })
  created_at: string;
}

export class DrawerListPaginationResponse {
  @ApiProperty({ description: '데이터 목록', type: [DrawerListItem] })
  drawerList: DrawerListItem[];

  @ApiProperty({ description: '전체 데이터 개수' })
  totalElement: number;

  @ApiProperty({ description: '전체 페이지 수' })
  totalPages: number;

  @ApiProperty({ description: '현재 조회중인 페이지' })
  currentPage: number;
}
