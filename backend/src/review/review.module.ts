import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { Admin } from 'src/entities/Admin.entity';
import { AuthService } from 'src/auth/auth.service';
import { Review } from 'src/entities/Review.entity';
import { Place } from 'src/entities/Place.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Admin, Review, Place])],
  controllers: [ReviewController],
  providers: [ReviewService, AuthService],
})
export class ReviewsModule {}
