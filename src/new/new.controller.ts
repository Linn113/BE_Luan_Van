import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { NewService } from './new.service';
import { CreateNewDto } from './dto/create-new.dto';
import { UpdateNewDto } from './dto/update-new.dto';
import { OffsetPaginationDto } from 'src/common/offsetPagination';

@Controller('new')
export class NewController {
  constructor(private readonly newService: NewService) {}

  @Post()
  create(@Body() createNewDto: CreateNewDto) {
    return this.newService.create(createNewDto);
  }

  @Get()
  findAll(@Query() queryPagination: OffsetPaginationDto) {
    return this.newService.findAll(queryPagination);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.newService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.newService.remove(id);
  }
}
