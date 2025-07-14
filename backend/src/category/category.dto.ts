import { IsString } from 'class-validator';

export class CategoryDto {
  id: string;
  name: string;
}

export class CategoryCreateDto {
  @IsString()
  name: string;
}
