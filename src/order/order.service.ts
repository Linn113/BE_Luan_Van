import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Between, Repository } from 'typeorm';
import { OrderStatus } from './entities/orderstatus.entity';
import { Payment } from './entities/payment.entity';
import { OffsetPaginationDto } from 'src/common/offsetPagination';
import { IOffsetPaginatedType } from 'src/common/IoffsetPanigation';
import { User } from 'src/user/entities/user.entity';
import { Cart } from 'src/user/entities/cart.entity';
import { Product } from 'src/product/entities/product.entity';
import { Address } from 'src/user/entities/adress.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Cart) private cartRepo: Repository<Cart>,
    @InjectRepository(Address) private addressRepo: Repository<Address>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(OrderStatus)
    private orderStatusRepo: Repository<OrderStatus>,
    @InjectRepository(Payment) private paymentRepo: Repository<Payment>,
  ) {}

  async findAll(
    queryPagination: OffsetPaginationDto,
  ): Promise<IOffsetPaginatedType<Order>> {
    const { limit, page, search, category, sortOrder, sortOrderBy } =
      queryPagination;

    const queryBuilder = this.orderRepo
      .createQueryBuilder('o') // Changed alias from 'order' to 'o'
      .leftJoinAndSelect('o.payment', 'payment')
      .leftJoinAndSelect('o.status', 'status');

    if (search) {
      const searchTerm = search.toLowerCase();
      queryBuilder.andWhere(
        'LOWER(o.description::text) LIKE :search', // Use new alias 'o'
        { search: `%${searchTerm}%` },
      );
    }

    if (sortOrder) {
      queryBuilder.orderBy(`o.${sortOrderBy || 'createdAt'}`, sortOrder); // Use new alias 'o'
    }

    queryBuilder.skip(limit * (page - 1)).take(limit);

    const [products, itemCount] = await queryBuilder.getManyAndCount();

    return {
      data: products,
      pageNumber: page,
      totalCount: itemCount,
      pageSize: limit,
    };
  }

  async findAllWithId(
    id: string,
    queryPagination: OffsetPaginationDto,
  ): Promise<IOffsetPaginatedType<Order>> {
    const { limit, page, search, category, sortOrder, sortOrderBy } =
      queryPagination;

    const queryBuilder = this.orderRepo
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.user', 'user')
      .leftJoinAndSelect('order.payment', 'payment')
      .leftJoinAndSelect('order.status', 'status')
      .where('user.id = :id', { id });

    if (sortOrder) {
      queryBuilder.orderBy(`order.${sortOrderBy || 'createdAt'}`, sortOrder);
    }

    queryBuilder.skip(limit * (page - 1)).take(limit);

    const [products, itemCount] = await queryBuilder.getManyAndCount();

    return {
      data: products,
      pageNumber: page,
      totalCount: itemCount,
      pageSize: limit,
    };
  }

  async getStatic(query: any) {  
    try {
      const { from, to } = query || {};
  
      // Parse query dates if provided
      const fromDate = from ? new Date(from) : null;
      const toDate = to ? new Date(to) : null;
  
      if (fromDate && isNaN(fromDate.getTime())) {
        throw new BadRequestException('Invalid "from" date format.');
      }
      if (toDate && isNaN(toDate.getTime())) {
        throw new BadRequestException('Invalid "to" date format.');
      }
  
      const statusList = await this.orderStatusRepo.find();
      const statusIds = statusList.map((status) => status.id);
  
      // Fetch status counts in a single query
      const statusCounts = await this.orderRepo
        .createQueryBuilder('o')
        .select('status.id', 'statusId')
        .addSelect('COUNT(o.id)', 'count')
        .leftJoin('o.status', 'status')
        .where('status.id IN (:...statusIds)', { statusIds })
        .groupBy('status.id')
        .getRawMany();
  
      const statusCount = statusCounts.reduce((acc, cur) => {
        const status = statusList.find((s) => s.id === cur.statusId);
        acc[status?.status] = parseInt(cur.count, 10);
        return acc;
      }, {});
  
      const pieChartData = {
        labels: Object.keys(statusCount),
        datasets: [
          {
            data: Object.values(statusCount),
            backgroundColor: this.generateColors(statusList.length),
            hoverBackgroundColor: this.generateColors(statusList.length),
          },
        ],
      };
  
      // Fetch monthly data
      const monthlyData = await this.orderRepo
        .createQueryBuilder('o')
        .select("DATE_TRUNC('month', o.createdAt) AS month")
        .addSelect('status.id', 'statusId')
        .addSelect('COUNT(o.id)', 'count')
        .leftJoin('o.status', 'status')
        .where('status.id IN (:...statusIds)', { statusIds })
        .groupBy('month, status.id')
        .orderBy('month', 'ASC')
        .getRawMany();
  
      const lineChartData = {
        labels: Array.from({ length: 12 }, (_, i) =>
          new Date(0, i).toLocaleString('default', { month: 'short' }),
        ),
        datasets: statusList.map((status) => {
          const data = Array(12).fill(0);
          monthlyData
            .filter((row) => row.statusId === status.id)
            .forEach((row) => {
              const monthIndex = new Date(row.month).getMonth();
              data[monthIndex] = parseInt(row.count, 10);
            });
  
          return {
            label: status.status,
            data,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
          };
        }),
      };
  
      const notification = await this.orderRepo.find({
        where: { status: { id: '1' } },
        relations: { status: true },
      });
  
      // Calculate top selling with optional date range
      const ordersQueryBuilder = this.orderRepo.createQueryBuilder('o');
  
      if (fromDate) {
        ordersQueryBuilder.andWhere('o.createdAt >= :fromDate', { fromDate });
      }
      if (toDate) {
        ordersQueryBuilder.andWhere('o.createdAt <= :toDate', { toDate });
      }
  
      const orders = await ordersQueryBuilder
        .andWhere('o.status.id = :statusId', { statusId: '2' }) // Assuming status.id = '2' is for completed orders
        .getMany();
  
      const topSelling = orders.reduce(
        (sum, order) => sum + order.totalPrice,
        0,
      );
  
      return {
        pie: pieChartData,
        line: lineChartData,
        notification,
        topSelling,
      };
    } catch (error) {
      console.error('Error fetching static data:', error);
      throw new BadRequestException('Failed to fetch static data.');
    }
  }


  generateColors(count: number): string[] {
    return Array.from(
      { length: count },
      () => `#${Math.floor(Math.random() * 16777215).toString(16)}`,
    );
  }

  async create(createOrderDto: CreateOrderDto) {
    let data: any;

    if (createOrderDto.isClient) {
      data = await this.createOrderIsClient(createOrderDto);
    } else {
      data = await this.createOrderIsNotClient(createOrderDto);
    }

    return data;
  }

  async updateStatus(id: string, createOrderDto: UpdateOrderDto) {
    try {
      const order = await this.orderRepo.findOne({
        where: {
          id: id,
        },
      });

      if (!order) {
        throw new NotFoundException('Đơn hàng không tìm thấy');
      }

      const statusData = await this.orderStatusRepo.findOne({
        where: {
          id: createOrderDto.status,
        },
      });

      if (!statusData) {
        throw new NotFoundException('trạng thái không tìm thấy');
      }

      order.status = statusData;

      await this.orderRepo.save(order);

      return order;
    } catch (error) {
      console.log(error);
      throw new BadGatewayException(error);
    }
  }

  private async createOrderIsNotClient(
    createOrderDto: CreateOrderDto,
  ): Promise<Order> {
    try {
      let data: any = {
        ...createOrderDto,
      };

      const payemnt = await this.paymentRepo.findOne({
        where: { name: createOrderDto.payment },
      });

      const status = await this.orderStatusRepo.findOne({
        where: {
          id: '1',
        },
      });

      if (!payemnt) {
        throw new NotFoundException(
          'Không thể tìm được phương thức thanh toán',
        );
      }

      if (!status) {
        throw new NotFoundException('Không thể tìm được Trạng thái đơn hàng');
      }

      data.payment = payemnt;
      data.status = status;

      const order = await this.orderRepo.save(data);

      if (!order) {
        throw new BadRequestException('Tạo đơn hàng lôi');
      }

      const products = createOrderDto.orderDetailJson
        ? JSON.parse(createOrderDto.orderDetailJson)
        : null;

      if (products) {
        for (let product of products) {
          const productDB = await this.productRepo.findOneById(product.id);

          productDB.numberSeller = product.numberSeller
            ? product.numberSeller
            : 0 + Number(product.quantity);

          await this.productRepo.save(productDB);
        }
      }
      return order;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  private async createOrderIsClient(createOrderDto: CreateOrderDto) {
    try {
      let data: any = {
        ...createOrderDto,
      };

      let user;

      const payemnt = await this.paymentRepo.findOne({
        where: { name: createOrderDto.payment },
      });

      const status = await this.orderStatusRepo.findOne({
        where: {
          id: '1',
        },
      });

      if (createOrderDto.userId) {
        user = await this.userRepo.findOne({
          where: {
            id: createOrderDto.userId,
          },
        });

        if (!user) {
          throw new NotFoundException(
            'Không thể tìm Thấy người dùng thanh toán',
          );
        }
        data.user = user;
      }

      if (!payemnt) {
        throw new NotFoundException(
          'Không thể tìm được phương thức thanh toán',
        );
      }

      if (!status) {
        throw new NotFoundException('Không thể tìm được Trạng thái đơn hàng');
      }

      data.payment = payemnt;
      data.status = status;

      const order = await this.orderRepo.save(data);

      if (!order) {
        throw new BadRequestException('Tạo đơn hàng lôi');
      }

      const cart = await this.cartRepo.findOne({
        where: {
          user: {
            id: createOrderDto.userId,
          },
        },
      });

      cart.detailCard = '';
      const products = createOrderDto.orderDetailJson
        ? JSON.parse(createOrderDto.orderDetailJson)
        : null;

      const addressIsExit = await this.addressRepo.findOne({
        where: {
          nameAddress: createOrderDto.address,
        },
      });

      if (!addressIsExit) {
        const address = this.addressRepo.create({
          nameAddress: createOrderDto.address,
        });

        address.user = user;

        await this.addressRepo.save(address);
      }

      if (products) {
        for (let product of products) {
          const productDB = await this.productRepo.findOneById(product.id);

          productDB.numberSeller = product.numberSeller
            ? product.numberSeller
            : 0 + Number(product.quantity);

          await this.productRepo.save(productDB);
        }
      }

      await this.cartRepo.save(cart);
      return order;
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error);
    }
  }
}
