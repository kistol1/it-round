import {
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from '../entities/Admin.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './auth.dto';
import { Request, Response } from 'express';
import { compare, hash } from 'bcrypt';

type JwtDecodedType = { sub: number; email: string; iat: number; exp: number };

@Injectable()
export class AuthService implements OnModuleInit {
  saltOrRounds: number = 13;

  constructor(
    @InjectRepository(Admin)
    private adminsRepository: Repository<Admin>,
    private jwtService: JwtService,
  ) {}

  async getAdmin(request: Request): Promise<Admin> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const token = request.cookies?.access_token;

    if (!token) {
      throw new UnauthorizedException('No access token');
    }

    try {
      const data: JwtDecodedType = await this.jwtService.verifyAsync(token);
      const admin = await this.adminsRepository.findOne({
        where: { id: data.sub },
      });

      if (!admin) {
        throw new UnauthorizedException('Admin not found');
      }

      return admin;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  async signIn({ login, password }: LoginDto, response: Response) {
    if (
      !login ||
      !password ||
      typeof login !== 'string' ||
      typeof password !== 'string'
    )
      throw new UnauthorizedException();
    const admin = await this.adminsRepository.findOneBy({ login });
    if (!admin || !admin.password || typeof admin.password !== 'string')
      throw new UnauthorizedException();

    if (!(await compare(password, admin.password)))
      throw new UnauthorizedException();

    const payload = { sub: admin.id, login: admin.login };
    response.cookie('access_token', await this.jwtService.signAsync(payload), {
      httpOnly: true,
      expires: new Date(new Date().getTime() + 259_200_000),
    });
    return '';
  }
  async onModuleInit() {
    const existingRole = await this.adminsRepository.find({});
    if (!process.env.ADMIN_LOGIN || !process.env.ADMIN_PASSWORD)
      throw new InternalServerErrorException();
    if (!existingRole.length) {
      const pass = await hash(process.env.ADMIN_PASSWORD, this.saltOrRounds);
      console.log(pass);
      const user: LoginDto = {
        login: process.env.ADMIN_LOGIN,
        password: pass,
      };
      const newRole = this.adminsRepository.create(user);
      await this.adminsRepository.save(newRole);
      console.log('Роль admin создана');
    }
  }
}
