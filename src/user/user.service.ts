import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { LoginRequestDTO } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OffsetPaginationDto } from 'src/common/offsetPagination';
import { IOffsetPaginatedType } from 'src/common/IoffsetPanigation';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async login(loginRequestDTO: LoginRequestDTO): Promise<{
    accessToken: string;
    isAdmin: boolean;
  }> {
    const user = await this.userRepository.findUserByEmail(
      loginRequestDTO.email,
    );

    if (!user) {
      throw new HttpException('Người dùng không tồn tại', HttpStatus.NOT_FOUND);
    }

    const isMatchPassword = await bcrypt.compare(
      loginRequestDTO.password,
      user.password,
    );

    if (!isMatchPassword) {
      throw new HttpException('Mật khẩu không hợp lệ', HttpStatus.UNAUTHORIZED);
    }

    const { accessToken } = await this.generateRefreshToken({
      sub: user.id,
    });

    return {
      isAdmin: user.isAdmin,
      accessToken,
    };
  }

  async register(registerDto: CreateUserDto): Promise<{
    accessToken: string;
    isAdmin: boolean;
  }> {
    const user = await this.userRepository.findUserByEmail(registerDto.email);

    if (user) {
      throw new HttpException(
        'Email Đã được sử dụng!!',
        HttpStatus.BAD_REQUEST,
      );
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(registerDto.password, salt);

    const newUser = await this.userRepository.createUser({
      ...registerDto,
      password: passwordHash,
    });

    const { accessToken } = await this.generateRefreshToken({
      sub: newUser.id,
    });

    return {
      isAdmin: false,
      accessToken: accessToken,
    };
  }

  async generateRefreshToken(payload: { sub: string }): Promise<{
    accessToken: string;
  }> {
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '10h',
    });

    return {
      accessToken,
    };
  }

  async getProfile(userId: string): Promise<User> {
    const user = await this.userRepository.findUserById(userId);

    if (!user) {
      throw new BadRequestException('Người dùng không tồn tại');
    }

    return user;
  }

  async updateProfile(userId: string, update: UpdateUserDto): Promise<User> {
    try {
      const userNeedUpdate = await this.userRepository.findUserById(userId);
      const userIsExit = await this.userRepository.findUserByEmail(
        update.email,
      );

      if (userIsExit && userNeedUpdate.email !== userIsExit.email) {
        throw new BadRequestException('Email đã tồn tại');
      }

      userNeedUpdate.firstName = update.firstName;
      userNeedUpdate.lastName = update.lastName;
      userNeedUpdate.email = update.email;
      userNeedUpdate.phone = update.phone;

      await this.userRepo.save(userNeedUpdate);

      return userNeedUpdate;
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error);
    }
  }

  async findAll(
    queryPagination: OffsetPaginationDto,
  ): Promise<IOffsetPaginatedType<User>> {
    const { limit, page, search, category, sortOrder, sortOrderBy } =
      queryPagination;

    const queryBuilder = this.userRepo.createQueryBuilder('u');

    if (search) {
      const searchTerm = search.toLowerCase();
      queryBuilder.andWhere(
        'LOWER(u.firstName) LIKE :search OR LOWER(u.lastName) LIKE :search OR LOWER(u.email) LIKE :search',
        { search: `%${searchTerm}%` },
      );
    }

    if (sortOrder) {
      queryBuilder.orderBy(`u.${sortOrderBy || 'createdAt'}`, sortOrder); // Use new alias 'o'
    }

    queryBuilder.skip(limit * (page - 1)).take(limit);

    const [users, itemCount] = await queryBuilder.getManyAndCount();

    return {
      data: users,
      pageNumber: page,
      totalCount: itemCount,
      pageSize: limit,
    };
  }
}
