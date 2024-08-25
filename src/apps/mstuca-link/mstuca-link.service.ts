import { CreateLinkDto, MstucaLinkGetListDto } from '@/shared/dtos';
import { Link } from '@/shared/schemas';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class MstucaLinkService {
  constructor(@InjectModel(Link.name) private readonly linkModel: Model<Link>) {}
  async create(createDto: CreateLinkDto): Promise<Link> {
    const createdLink = new this.linkModel(createDto);

    return createdLink.save();
  }

  async findAll(): Promise<Link[]> {
    return this.linkModel.find().exec();
  }

  async getList(query: MstucaLinkGetListDto): Promise<Link[]> {
    const result = await this.linkModel.find(query);

    return result;
  }

  async updateOne(data: CreateLinkDto): Promise<void> {
    try {
      await this.linkModel.findOneAndUpdate(
        { id: data.id, hash: data.hash },
        data,
        { upsert: true },
      ).exec();
    } catch (err) {
      console.error(err);
    }
  }

  async deleteById(id: string): Promise<void> {
    await this.linkModel.deleteMany({ id });
  }
}
