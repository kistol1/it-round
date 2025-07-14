import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlacesService } from './places.service';
import { PlacesController } from './places.controller';
import { Place } from 'src/entities/Place.entity';
import { Photo } from 'src/entities/Photo.entity';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { Admin } from 'src/entities/Admin.entity';
import { AuthService } from 'src/auth/auth.service';

const uploadDir = join(process.cwd(), 'uploads');
@Module({
  imports: [
    TypeOrmModule.forFeature([Place, Photo, Admin]),
    MulterModule.register({
      storage: diskStorage({
        destination: (req, file, cb) => {
          cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
          const ext = extname(file.originalname);
          const filename = `${crypto.randomUUID()}${ext}`;
          cb(null, filename);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (['image/png', 'image/webp', 'image/jpeg'].includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error('Only images are allowed...'), false);
        }
      },
    }),
  ],
  controllers: [PlacesController],
  providers: [PlacesService, AuthService],
})
export class PlacesModule {}
