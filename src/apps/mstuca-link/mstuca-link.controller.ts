import { CreateLinkDto, MstucaLinkGetListDto } from '@/shared/dtos';
import { Link } from '@/shared/schemas';
import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { MstucaLinkHttpService } from './mstuca-link.http-service';
import { MstucaLinkService } from './mstuca-link.service';

@Controller('mstucaLink')
export class MstucaLinkController {
  constructor(
    private readonly mstucaLinkService: MstucaLinkService,
    private readonly mstucaLinkHttpService: MstucaLinkHttpService,
  ) {}

  @Post()
  async create(@Body() body: CreateLinkDto): Promise<Link> {
    const result = await this.mstucaLinkService.create(body);

    return result;
  }

  @Get('all')
  async getAll(): Promise<Link[]> {
    const result = await this.mstucaLinkService.findAll();

    return result;
  }

  @Get('links')
  async getLinks(): Promise<CreateLinkDto[]> {
    const result = await this.mstucaLinkHttpService.getLinksForCreate();

    return result;
  }

  @Post('getList')
  async getList(@Body() body: MstucaLinkGetListDto): Promise<Link[]> {
    const result = await this.mstucaLinkService.getList(body);

    return result;
  }

  @Delete()
  async deleteById(@Query('id') id: string): Promise<void> {
    await this.mstucaLinkService.deleteById(id);
  }

  @Get('forceSync')
  async syncForceLinks(): Promise<void> {
    const result = await this.mstucaLinkHttpService.getLinksForCreate();

    result.forEach((i) => {
      void this.mstucaLinkService.updateOne(i);
    });
  }

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async syncLinks(): Promise<void> {
    const result = await this.mstucaLinkHttpService.getLinksForCreate();

    result.forEach((i) => {
      void this.mstucaLinkService.updateOne(i);
    });
  }
}
