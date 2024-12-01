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
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginRequestDTO } from './dto/login.dto';
import { AuthGuard } from './guard/auth.guard';
import { OffsetPaginationDto } from 'src/common/offsetPagination';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  login(@Body() createUserDto: LoginRequestDTO) {
    return this.userService.login(createUserDto);
  }

  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.userService.register(createUserDto);
  }

  @Get('Profile')
  @UseGuards(AuthGuard)
  getProfile(@Req() req) {
    return this.userService.getProfile(req.user.sub);
  }

  @Put('Profile')
  @UseGuards(AuthGuard)
  updateProfile(@Req() req, @Body() update: UpdateUserDto) {
    return this.userService.updateProfile(req.user.sub, update);
  }

  @Get('admin')
  getAll(@Query() queryPagination: OffsetPaginationDto) {
    return this.userService.findAll(queryPagination);
  }

  @Put(':id/admin')
  updateUser(@Param('id') id: string, @Body() updateUser: UpdateUserDto) {
    return this.userService.updateProfile(id, updateUser);
  }
}   
