import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsBoolean,
  IsNumber,
  IsArray,
} from 'class-validator';

export class PlaceDto {
  id: string;
  name: string;
  category: string;
  short_description: string;
  full_description: string;
  x: number;
  y: number;
  rating: number;
  reviews_amount: number;
  photos: { id: string; file_name: string }[];
}

export class PlaceCreateDto {
  @IsString()
  name: string;

  @IsString()
  category: string;

  @IsString()
  short_description: string;

  @IsString()
  full_description: string;

  @IsOptional()
  @IsString()
  yandex_link?: string;

  @IsNumber()
  x: number;

  @IsNumber()
  y: number;
}

export class GetPlacesQuery {
  @ApiPropertyOptional({
    description: 'Категории мест',
    example: ['museum', 'park'],
    isArray: true,
    type: String,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }): string[] =>
    Array.isArray(value) ? value : typeof value === 'string' ? [value] : [],
  )
  category?: string[];

  @ApiPropertyOptional({
    description: 'Фильтровать только одобренные',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value !== 'false')
  approved?: boolean;
}

export class SearchPlaceDto {
  @ApiPropertyOptional({ example: 'музей' })
  @IsOptional()
  @IsString()
  query?: string;
}
