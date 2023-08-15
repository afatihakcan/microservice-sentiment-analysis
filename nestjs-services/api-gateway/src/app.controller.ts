import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Post, Query, Request, UseFilters, UseGuards } from '@nestjs/common';
import { CustomHttpExceptionFilter } from './ http-exception.filter';
import { AppService } from './app.service';
import { AuthGuard } from './auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Controller()
@UseFilters(CustomHttpExceptionFilter)
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Post("/login")
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<any> {
    try {
      return await this.appService.login(loginDto.email, loginDto.password);
    } catch (e: any) {
      if (e.error.status === 'error') {
        throw new HttpException(e.error.message, e.error.code);
      }
    }
  }

  @Post("/create_user")
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() createUserDto: CreateUserDto): Promise<any> {
    try {
      return await this.appService.createUser(createUserDto);
    } catch (e) {
      if (e.error.status === 'error') {
        throw new HttpException(e.error.message, e.error.code);
      }
    }
  }

  @UseGuards(AuthGuard)
  @Get("/analyze")
  @HttpCode(HttpStatus.OK)
  async getAnalysis(@Query('text') text: string, @Request() req): Promise<any> {
    return await this.appService.analyze(text, req.userId);
  }

  @UseGuards(AuthGuard)
  @Get("/getLast10Analysis")
  @HttpCode(HttpStatus.OK)
  async getLast10Analysis(@Request() req): Promise<any> {
    return await this.appService.getLast10Analysis(req.userId);
  }

  @UseGuards(AuthGuard)
  @Delete("/deleteAnalysis")
  @HttpCode(HttpStatus.OK)
  async deleteAnalysis(@Query('id') id: string, @Request() req): Promise<any> {
    try {
      return await this.appService.deleteAnalysis(id, req.userId);
    } catch (e) {
      if (e.error.status === 'error') {
        throw new HttpException(e.error.message, e.error.code);
      }
    }
  }
}