import { IsEmail, IsNotEmpty, IsNumber, IsPhoneNumber, IsString } from 'class-validator';


export class AddItemToCardDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}
