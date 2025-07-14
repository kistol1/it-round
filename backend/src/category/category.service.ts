import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from 'src/entities/Category.entity';
import { CategoryCreateDto, CategoryDto } from './category.dto';

@Injectable()
export class CategorysService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async getCategories(): Promise<CategoryDto[]> {
    return await this.categoriesRepository.find();
  }
  async createCategory(body: CategoryCreateDto) {
    return await this.categoriesRepository.save(body);
  }
  async deleteCategory(id: string) {
    return await this.categoriesRepository.delete(id);
  }
  async updateCategory(id: string, body: CategoryCreateDto) {
    return await this.categoriesRepository.update(id, body);
  }
}
