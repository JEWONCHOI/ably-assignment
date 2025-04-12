import {
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
