import { ApiProperty } from '@nestjs/swagger';
import { ChangeCursorPagiFormResponse } from 'src/common/dto/pagination.dto';

class DrawerSimpleInfo {
  @ApiProperty({ example: 414 })
  id: number;

  @ApiProperty({ example: '케이스' })
  name: string;
}

export class GetDrawerWithZzimsResponse<T extends { created_at: string }> {
  @ApiProperty({ type: DrawerSimpleInfo })
  drawer: DrawerSimpleInfo;

  @ApiProperty({ type: () => ChangeCursorPagiFormResponse })
  zzims: ChangeCursorPagiFormResponse<T>;
}
