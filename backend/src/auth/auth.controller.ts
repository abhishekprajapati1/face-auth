import { Controller, Post, Body, Res, HttpStatus, Get, UseGuards, Req, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/signup.dto';
import { ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { AuthGuard, ExtendedRequest } from './auth.guard';

@Controller('auth')
@ApiTags("Authentication")
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post("signup")
  async signup(@Body() signupDto: CreateAuthDto) {
    await this.authService.signup(signupDto);
    return { success: true, message: "Registered successfully." }
  }
  @Post("login")
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const user = await this.authService.getValidUser(loginDto);

    const token = this.authService.generateToken(user);
    this.authService.setCookie(res, { data: token, name: "auth_token" });
    return res.status(HttpStatus.OK).json({ success: true, message: "Logged in successfully." });
  }

  @UseGuards(AuthGuard)
  @Get("details")
  async getUserDetails(@Req() req: ExtendedRequest) {
    const data = req.user;
    return { success: true, data }
  }

  @UseGuards()
  @Delete('logout')
  logout(@Res() response: Response) {
    this.authService.removeCookie(response, "auth_token");
    return response.status(HttpStatus.OK).json({ success: true, message: "Logged out successfully." });
  }
}
