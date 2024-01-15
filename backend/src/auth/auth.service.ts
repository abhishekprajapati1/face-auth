import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/signup.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { compareStrings, hashString } from 'utils';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {

  constructor(
    private readonly prisma: PrismaService
  ) { }


  generateToken(payload: any, options?: jwt.SignOptions) {
    return jwt.sign(payload, process.env.APP_SECRET_KEY, { expiresIn: '2h', ...(options && options) });
  }

  verifyToken(token: string): any {
    try {
      const decoded = jwt.verify(token, process.env.APP_SECRET_KEY);
      return decoded;
    } catch (error) {
      return null;
    }
  }


  setCookie(response: Response, { data, age, name }: { data: any, age?: number, name: string }): void {
    response.cookie(name, data, {
      maxAge: age || 2 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "none",
      secure: true,
    })
  }

  removeCookie(response: Response, name: string): void {
    response.clearCookie(name, {});
  }

  async doesUserExists(email: string) {
    return Boolean(await this.prisma.user.findUnique({ where: { email } }));
  }


  async signup(createAuthDto: CreateAuthDto) {
    if (await this.doesUserExists(createAuthDto.email)) throw new BadRequestException({ success: false, message: "User with same email address already exists." });
    createAuthDto.password = hashString(createAuthDto.password);

    await this.prisma.user.create({ data: createAuthDto });
  }

  async getValidUser(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: loginDto.email } });
    if (!user) throw new BadRequestException({ success: false, message: "Invalid credentials." });

    const isValidPassword = compareStrings(loginDto.password, user.password);
    if (!isValidPassword) throw new BadRequestException({ success: false, message: "Invalid credentials." });
    delete user.password;
    return user;
  }
}
