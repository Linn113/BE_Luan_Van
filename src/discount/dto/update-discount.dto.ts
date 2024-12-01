import { PartialType } from '@nestjs/mapped-types';
import { CreateDiscountDto } from './create-discount.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateDiscountDto {
  @IsNotEmpty()
  products: any;
}
