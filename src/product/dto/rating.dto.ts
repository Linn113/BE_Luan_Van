import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class RatingDto {
  @IsNotEmpty()
  @IsNumber()
  sao: number;

  @IsNotEmpty()
  @IsString()
  danhGia: string;
}
