import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { PlacesService } from './places.service';
import { Request as RequestEx } from 'express';
import {
  GetPlacesQuery,
  PlaceCreateDto,
  PlaceDto,
  SearchPlaceDto,
} from './places.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthService } from 'src/auth/auth.service';

@Controller('/api/v1/places')
export class PlacesController {
  constructor(
    private readonly authService: AuthService,
    private readonly placesService: PlacesService,
  ) {}

  @Get()
  async getPlaces(
    @Request() req: RequestEx,
    @Query() query: GetPlacesQuery,
  ): Promise<PlaceDto[]> {
    const { approved, category } = query;
    console.log(query);
    if (!approved) {
      await this.authService.getAdmin(req);
    }

    return this.placesService.getPlaces(approved, category);
  }

  @Get('search')
  search(@Query() queryDto: SearchPlaceDto) {
    return this.placesService.searchPlaces(queryDto.query);
  }

  @Post('/:id/upload')
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: Math.pow(1024, 2) * 100 } }),
  )
  async uploadImage(
    @UploadedFile() file: { filename: string },
    @Param('id') id: string,
  ) {
    await this.placesService.uploadPhoto(file.filename, id);
  }

  @Post('/:id/approve')
  async approvePlace(@Request() req: RequestEx, @Param('id') id: string) {
    await this.authService.getAdmin(req);
    await this.placesService.placeApprove(id);
  }

  @Delete('/:id')
  async deletePlace(@Request() req: RequestEx, @Param('id') id: string) {
    await this.authService.getAdmin(req);
    await this.placesService.placeDelete(id);
  }

  @Post()
  async createPlace(@Body() body: PlaceCreateDto) {
    console.log(body.name);
    return await this.placesService.createPlace(body);
  }
}
