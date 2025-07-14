import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Request,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './auth.dto';
import { Admin } from '../entities/Admin.entity';
import { Request as RequestEx, Response } from 'express';

@Controller('api/v1/')
export class LoginController {
  constructor(private readonly authService: AuthService) {}

  @Get('user')
  async getAdmin(@Request() req: RequestEx): Promise<Admin> {
    return await this.authService.getAdmin(req);
  }

  @Post('login')
  @HttpCode(200)
  login(
    @Body() data: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<string> {
    return this.authService.signIn(data, response);
  }
}
