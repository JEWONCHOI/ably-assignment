import {
  ChangeCursorPagiFormDto,
  ChangeCursorPagiFormResponse,
} from '../dto/pagination.dto';

export function changeCursorPagiForm<T extends { id: number }>(
  changeCursorPagiFormDto: ChangeCursorPagiFormDto<T>,
): ChangeCursorPagiFormResponse<T> {
  const { dataList, size } = changeCursorPagiFormDto;
  const hasNext = dataList.length > size;
  const sliced = hasNext ? dataList.slice(0, size) : dataList;

  return {
    data: sliced,
    meta: {
      nextCursor: hasNext ? sliced[sliced.length - 1].id : null,
      hasNext,
      size,
    },
  };
}
