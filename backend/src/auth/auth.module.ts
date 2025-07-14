import { Admin } from './../entities/Admin.entity';
import { Module } from '@nestjs/common';
import { LoginController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Admin])],
  controllers: [LoginController],
  providers: [AuthService],
})
export class AuthModule {}
