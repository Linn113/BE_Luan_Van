import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findUserByEmail(email: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: {
          email: email,
        },
      });
      return user;
    } catch (error) {
      throw new HttpException(
        'Find user By Email fail',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findUserById(id: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: {
          id: id,
        },
        relations:  {
          addresses: true
        }
      });
      return user;
    } catch (error) {
      throw new HttpException(
        'Find user By Email fail',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      const user = await this.userRepository.save(createUserDto);
      return user;
    } catch (error) {
      console.log(error);
      throw new HttpException('create user fail', HttpStatus.BAD_REQUEST);
    }
  }
}
