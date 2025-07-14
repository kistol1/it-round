import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, In, Repository } from 'typeorm';
import { Place } from 'src/entities/Place.entity';
import { Photo } from 'src/entities/Photo.entity';
import { PlaceCreateDto, PlaceDto } from './places.dto';

@Injectable()
export class PlacesService {
  constructor(
    @InjectRepository(Place)
    private placesRepository: Repository<Place>,
    @InjectRepository(Photo)
    private photosRepository: Repository<Photo>,
  ) {}
  async getPlaces(
    approved?: boolean,
    category?: string[],
  ): Promise<PlaceDto[]> {
    const where: FindOptionsWhere<Place> = {
      is_approved: approved,
    };

    if (category?.length && category[0]) {
      where.category = In(category);
    }

    const places = await this.placesRepository.find({
      where,
      relations: ['photos', 'reviews'],
    });

    return places.map((place) => ({
      id: place.id,
      name: place.name,
      category: place.category,
      short_description: place.short_description,
      full_description: place.full_description,
      x: place.x,
      y: place.y,
      yandex_link: place.yandex_link,
      reviews_amount: place.reviews.length,
      rating: place.reviews.length
        ? place.reviews.reduce((p, c) => p + c.rating, 0) / place.reviews.length
        : 0,
      photos: place.photos.map((p) => ({
        id: p.id,
        file_name: `/uploads/${p.file_path}`,
      })),
    }));
  }

  async uploadPhoto(filePath: string, placeId: string): Promise<void> {
    const photo = this.photosRepository.create();
    photo.place = placeId;
    photo.file_path = filePath;
    await this.photosRepository.save(photo);
  }

  async createPlace(body: PlaceCreateDto) {
    return await this.placesRepository.save(body);
  }

  async placeApprove(id: string) {
    const place = await this.placesRepository.findOne({ where: { id } });
    if (!place) throw new NotFoundException();
    return await this.placesRepository.save({ ...place, is_approved: true });
  }

  async placeDelete(id: string) {
    await this.placesRepository.delete(id);
  }

  async searchPlaces(query?: string): Promise<PlaceDto[]> {
    const qb = this.placesRepository
      .createQueryBuilder('place')
      .leftJoinAndSelect('place.photos', 'photo')
      .leftJoinAndSelect('place.reviews', 'review')
      .where('place.is_approved = :approved', { approved: true });

    if (query) {
      qb.andWhere(
        `(LOWER(place.name) LIKE LOWER(:query) OR 
          LOWER(place.category) LIKE LOWER(:query) OR 
          LOWER(place.short_description) LIKE LOWER(:query) OR 
          LOWER(place.full_description) LIKE LOWER(:query))`,
        { query: `%${query}%` },
      );
    }

    const places = await qb.getMany();
    return places.map((place) => ({
      id: place.id,
      name: place.name,
      category: place.category,
      short_description: place.short_description,
      full_description: place.full_description,
      x: place.x,
      y: place.y,
      yandex_link: place.yandex_link,
      reviews_amount: place.reviews.length,
      rating: place.reviews.length
        ? place.reviews.reduce((p, c) => p + c.rating, 0) / place.reviews.length
        : 0,
      photos: place.photos.map((p) => ({
        id: p.id,
        file_name: `/uploads/${p.file_path}`,
      })),
    }));
  }
}
