import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFiles,
  UploadedFile,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { OffsetPaginationDto } from 'src/common/offsetPagination';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/clodinary.service';
import { RatingDto } from './dto/rating.dto';
import { AuthGuard } from 'src/user/guard/auth.guard';

@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Post('menu')
  createMenu(@Body() createProductDto: CreateProductDto) {
    return this.productService.createMenu(createProductDto);
  }

  @Post('/:productId/rating/:userId')
  reating(
    @Param('productId') productId: string,
    @Param('userId') userId: string,
    @Body() createProductDto: RatingDto,
  ) {
    return this.productService.rating(productId, userId, createProductDto);
  }

  @Get()
  findAll(@Query() productQueryPagination: OffsetPaginationDto) {
    return this.productService.findAll(productQueryPagination);
  }

  @Get('withoutPag')
  findAllWithoutPag() {
    return this.productService.findAllWithoutPag();
  }

  @Get('/withoutPaginate')
  findAllProduct() {
    return this.productService.findAddWithoutPaginate();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    return this.cloudinaryService.uploadFile(file);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.update(id, updateProductDto);
  }
}