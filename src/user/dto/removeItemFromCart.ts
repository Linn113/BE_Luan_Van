import { IsEmail, IsNotEmpty, IsNumber, IsPhoneNumber, IsString } from 'class-validator';


export class RemoveItemToCardDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}
