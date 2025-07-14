import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategorysService } from './category.service';
import { CategoriesController } from './category.controller';
import { Category } from 'src/entities/Category.entity';
import { Admin } from 'src/entities/Admin.entity';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Admin])],
  controllers: [CategoriesController],
  providers: [CategorysService, AuthService],
})
export class CategoriesModule {}
