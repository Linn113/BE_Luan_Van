import { Module } from '@nestjs/common';
import { NewService } from './new.service';
import { NewController } from './new.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { New } from './entities/new.entity';
import { Section } from './entities/section.entity';

@Module({
  imports: [TypeOrmModule.forFeature([New, Section])],
  controllers: [NewController],
  providers: [NewService],
})
export class NewModule {}
