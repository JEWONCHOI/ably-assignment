import {
  ChangeCursorPagiFormDto,
  ChangeCursorPagiFormResponse,
  ChangePaginationFormDto,
  ChangePaginationFormResponse,
} from '../dto/pagination.dto';

export function changePaginationForm<T>(
  dto: ChangePaginationFormDto<T>,
): ChangePaginationFormResponse<T> {
  return {
    [dto.dataName]: dto.data,
    totalElement: dto.totalElement,
    totalPages: Math.ceil(dto.totalElement / dto.take),
    currentPage: dto.page,
  };
}

export function changeCursorPagiForm<T extends { created_at: string }>(
  changeCursorPagiFormDto: ChangeCursorPagiFormDto<T>,
): ChangeCursorPagiFormResponse<T> {
  const { dataList, size } = changeCursorPagiFormDto;
  const hasNext = dataList.length > size;
  const sliced = hasNext ? dataList.slice(0, size) : dataList;

  return {
    data: sliced,
    meta: {
      nextCursor: hasNext ? sliced[sliced.length - 1].created_at : null,
      hasNext,
      size,
    },
  };
}
