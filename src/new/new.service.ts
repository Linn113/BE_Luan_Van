import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateNewDto } from './dto/create-new.dto';
import { UpdateNewDto } from './dto/update-new.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { New } from './entities/new.entity';
import { Repository } from 'typeorm';
import { Section } from './entities/section.entity';
import { OffsetPaginationDto } from 'src/common/offsetPagination';
import { IOffsetPaginatedType } from 'src/common/IoffsetPanigation';

@Injectable()
export class NewService {
  constructor(
    @InjectRepository(New) private newRepo: Repository<New>,
    @InjectRepository(Section) private sectionRepo: Repository<Section>,
  ) {}

  async create(createNewDto: CreateNewDto) {
    try {
      const sections = [];

      for (let section of createNewDto.sections) {
        const newSection = this.sectionRepo.create(section);

        if (!newSection) {
          throw new BadRequestException('create section failed');
        }

        await this.sectionRepo.save(newSection);

        sections.push(newSection);
      }

      const news = await this.newRepo.save({
        title: createNewDto.title,
        description: createNewDto.description,
        imageUrl: createNewDto.imageUrl,
        contents: sections,
      });

      return news;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('create failed', error);
    }
  }

  async findAll(
    queryPagination: OffsetPaginationDto,
  ): Promise<IOffsetPaginatedType<New>> {
    const { limit, page, search, sortOrder, sortOrderBy } = queryPagination;

    const queryBuilder = this.newRepo
      .createQueryBuilder('u')
      .leftJoinAndSelect('u.contents', 'contents'); // Adjusted to join 'contents'

    if (search) {
      const searchTerm = search.toLowerCase();
      queryBuilder.andWhere(
        'LOWER(u.title) LIKE :search OR LOWER(u.description) LIKE :search',
        { search: `%${searchTerm}%` },
      );
    }

    if (sortOrder) {
      queryBuilder.orderBy(`u.${sortOrderBy || 'createdAt'}`, sortOrder);
    }

    queryBuilder.skip(limit * (page - 1)).take(limit);

    const [news, itemCount] = await queryBuilder.getManyAndCount();

    return {
      data: news,
      pageNumber: page,
      totalCount: itemCount,
      pageSize: limit,
    };
  }

  async findOne(id: string) {
    try {
      const news = await this.newRepo.findOne({
        where: {
          id: id,
        },
        relations: {
          contents: true,
        },
      });

      if(!news) {
        throw new NotFoundException('No news found');
      }

      return news
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async remove(id: string) {
    try {
      // Find the news with related contents
      const news = await this.newRepo.findOne({
        where: { id },
        relations: { contents: true },
      });

      if (!news) {
        throw new NotFoundException('News not found');
      }

      // Delete each related content by ID
      for (const content of news.contents) {
        await this.sectionRepo.delete(content.id);
      }

      // Finally, delete the news itself by ID
      const newsDeleted = await this.newRepo.delete(news.id);

      return newsDeleted;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Delete failed', error);
    }
  }
}
