import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AddItemToCardDto } from './dto/addItemToCard.dto';
import { CartService } from './cart.service';
import { RemoveItemToCardDto } from './dto/removeItemFromCart';

@Controller('cart')
export class CartController {
  constructor(private readonly cardService: CartService) {}

  @Get('/:userId')
  getCard(@Param('userId') userId: string) {
    return this.cardService.getCard(userId);
  }

  @Put('/add/:userId')
  register(@Param('userId') userId: string, @Body() item: AddItemToCardDto) {
    return this.cardService.addItemToCard(userId, item);
  }

  @Put('/minus/:userId')
  minusveItem(@Param('userId') userId: string, @Body() item: RemoveItemToCardDto) {
    return this.cardService.minusItemToCard(userId, item);
  }

  @Put('/remove/:userId')
  removeItem(@Param('userId') userId: string, @Body() item: RemoveItemToCardDto) {
    return this.cardService.removeItemToCard(userId, item);
  }
}
