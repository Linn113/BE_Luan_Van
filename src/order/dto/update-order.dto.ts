import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateOrderDto {
  @IsNotEmpty()
  status: string;
}
