import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '../entities/Review.entity';
import { CreateReviewDto } from './review.dto';
import { Place } from '../entities/Place.entity';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private reviewRepo: Repository<Review>,

    @InjectRepository(Place)
    private placeRepo: Repository<Place>,
  ) {}

  async create(dto: CreateReviewDto): Promise<Review> {
    const place = await this.placeRepo.findOne({ where: { id: dto.placeId } });
    if (!place) throw new NotFoundException('Place not found');

    const review = this.reviewRepo.create({
      name: dto.name,
      text: dto.text,
      rating: dto.rating,
      place,
    });

    return this.reviewRepo.save(review);
  }

  async findByPlace(placeId: string): Promise<Review[]> {
    return this.reviewRepo.find({
      where: { place: { id: placeId } },
      order: { rating: 'DESC' },
    });
  }

  async findAll(): Promise<Review[]> {
    return this.reviewRepo.find({
      order: { rating: 'DESC' },
    });
  }

  async delete(id: string): Promise<void> {
    await this.reviewRepo.delete(id);
  }
}
