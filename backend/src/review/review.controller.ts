import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './review.dto';
import { AuthService } from 'src/auth/auth.service';
import { Request as RequestEx } from 'express';

@Controller('/api/v1/reviews')
export class ReviewController {
  constructor(
    private readonly reviewService: ReviewService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  create(@Body() dto: CreateReviewDto) {
    return this.reviewService.create(dto);
  }

  @Get()
  async getAll(@Request() req: RequestEx) {
    await this.authService.getAdmin(req);
    return this.reviewService.findAll();
  }

  @Get(':placeId')
  getByPlace(@Param('placeId') placeId: string) {
    return this.reviewService.findByPlace(placeId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reviewService.delete(id);
  }
}
