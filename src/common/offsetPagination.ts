import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class OffsetPaginationDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(20)
  limit: number = 6;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @Type(() => String)
  @IsString()
  @IsOptional()
  category?: string = 'all';

  @Type(() => String)
  @IsString()
  @IsOptional()
  search?: string = '';

  @IsString()
  @IsOptional()
  sortOrder?: 'ASC' | 'DESC';

  @IsString()
  @IsOptional()
  sortOrderBy?: string;
}
