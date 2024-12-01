import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateDiscountDto {
  @IsNotEmpty()
  @IsString()
  title: string;
  
  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  percent: number;

  @IsNotEmpty()
  @IsString()
  dateStart: string;

  @IsNotEmpty()
  @IsString()
  dateEnd: string;
}
