import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
  Req,
  Res,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { OrderService } from './order.service';
import * as moment from 'moment';
import * as qs from 'qs';
import * as crypto from 'crypto';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OffsetPaginationDto } from 'src/common/offsetPagination';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Controller('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private configService: ConfigService,
  ) {}

  @Get('')
  getAll(@Query() queryPagination: OffsetPaginationDto) {
    return this.orderService.findAll(queryPagination);
  }

  @Get('static')
  getStaticAll(@Query() query: any) {
    return this.orderService.getStatic(query);
  }

  @Get('/user/:id')
  getAllWithId(
    @Param('id') id: string,
    @Query() queryPagination: OffsetPaginationDto,
  ) {
    return this.orderService.findAllWithId(id, queryPagination);
  }

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @Get('/VnPay')
  vnpayReturn(@Query() vnpParams) {
    let secureHash = vnpParams['vnp_SecureHash'];
    delete vnpParams['vnp_SecureHash'];
    delete vnpParams['vnp_SecureHashType'];

    let vnpParamsSorted = this.sortObject(vnpParams);

    let tmnCode = this.configService.get<string>('TMN_CODE');

    let secretKey = this.configService.get<string>('SECRET_KEY');

    let signData = qs.stringify(vnpParamsSorted, {
      encode: false,
    });

    let hmac = crypto.createHmac('sha512', secretKey);

    let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    if (secureHash === signed) {
      // Check if the data in the database is valid and notify the result
      return {
        code: vnpParamsSorted['vnp_ResponseCode'],
      };
    } else {
      return { code: '97' };
    }
  }

  @Post('/VnPay')
  createPaymentUrl(@Req() req: Request, @Res() res: Response) {
    try {
      process.env.TZ = 'Asia/Ho_Chi_Minh';

      const date = new Date();
      const createDate = moment(date).format('YYYYMMDDHHmmss');
      const expireDate = moment(date)
        .add(15, 'minutes')
        .format('YYYYMMDDHHmmss');

      const ipAddr =
        req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress;

      const tmnCode = this.configService.get<string>('TMN_CODE');
      const secretKey = this.configService.get<string>('SECRET_KEY');
      let vnpUrl = this.configService.get<string>('VNP_URL');
      const returnUrl = this.configService.get<string>('RETURN_URL');

      const orderId = moment(date).format('HHmmss');

      const amount = req.body.amount;
      const bankCode = req.body.bankCode;

      let locale = req.body.language;
      if (locale === null || locale === '') {
        locale = 'vn';
      }
      const currCode = 'VND';
      let vnp_Params: any = {};
      vnp_Params['vnp_Version'] = '2.1.0';
      vnp_Params['vnp_Command'] = 'pay';
      vnp_Params['vnp_TmnCode'] = tmnCode;
      vnp_Params['vnp_Locale'] = locale;
      vnp_Params['vnp_CurrCode'] = currCode;
      vnp_Params['vnp_TxnRef'] = orderId;
      vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId;
      vnp_Params['vnp_OrderType'] = 'ATM';
      vnp_Params['vnp_Amount'] = amount * 100;
      vnp_Params['vnp_ReturnUrl'] = returnUrl;
      vnp_Params['vnp_IpAddr'] = ipAddr;
      vnp_Params['vnp_CreateDate'] = createDate;
      vnp_Params['vnp_ExpireDate'] = expireDate;
      if (bankCode !== null && bankCode !== '') {
        vnp_Params['vnp_BankCode'] = bankCode;
      }

      vnp_Params = this.sortObject(vnp_Params);

      const signData = qs.stringify(vnp_Params, {
        encode: false,
      });
      const hmac = crypto.createHmac('sha512', secretKey);
      const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

      vnp_Params['vnp_SecureHash'] = signed;
      vnpUrl +=
        '?' +
        qs.stringify(vnp_Params, {
          encode: false,
        });

      res.status(200).json({
        directURL: vnpUrl,
        secureHashValue: signed,
        vnp_TxnRef: orderId,
      });
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('/:id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() createOrderDto: UpdateOrderDto,
  ) {
    return this.orderService.updateStatus(id, createOrderDto);
  }

  sortObject(obj: any) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        str.push(encodeURIComponent(key));
      }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
      sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
    }
    return sorted;
  }
}
