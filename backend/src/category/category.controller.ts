import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
} from '@nestjs/common';
import { CategorysService } from './category.service';
import { CategoryCreateDto, CategoryDto } from './category.dto';
import { Request as RequestEx } from 'express';
import { AuthService } from 'src/auth/auth.service';

@Controller('/api/v1/category')
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategorysService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  async getCategories(): Promise<CategoryDto[]> {
    return this.categoriesService.getCategories();
  }

  @Post()
  async createCategory(
    @Request() req: RequestEx,
    @Body() body: CategoryCreateDto,
  ) {
    await this.authService.getAdmin(req);
    await this.categoriesService.createCategory(body);
  }

  @Delete('/:id')
  async deleteCategory(@Request() req: RequestEx, @Param('id') id: string) {
    await this.authService.getAdmin(req);
    await this.categoriesService.deleteCategory(id);
  }

  @Put('/:id')
  async updateCategory(
    @Request() req: RequestEx,
    @Param('id') id: string,
    @Body() body: CategoryCreateDto,
  ) {
    await this.authService.getAdmin(req);
    await this.categoriesService.updateCategory(id, body);
  }
}
