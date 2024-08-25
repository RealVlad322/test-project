import { CreateSheduleDto, Directions, SheduleGetListDto } from '@/shared/dtos';
import { Shedule } from '@/shared/schemas';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class SheduleService {
  constructor(@InjectModel(Shedule.name) private readonly sheduleModel: Model<Shedule>) {}

  async create(createDto: CreateSheduleDto): Promise<Shedule> {
    const createdShedule = new this.sheduleModel(createDto);

    return createdShedule.save();
  }

  async findAll(): Promise<Shedule[]> {
    return this.sheduleModel.find().exec();
  }

  async getShedules(query: SheduleGetListDto): Promise<Shedule[]> {
    const { grade, name, group, startTimeStamp, endTimeStamp, sortByDate } = query;
    const result = await this.sheduleModel
      .find(
        {
          date: { $gte: startTimeStamp, $lte: endTimeStamp },
          grade,
          name,
          group,
        },
        {},
      )
      .sort({ date: sortByDate === Directions.DESC ? 1 : -1 })
      .exec();

    return result;
  }

  async update(data: CreateSheduleDto): Promise<void> {
    try {
      await this.sheduleModel
        .findOneAndUpdate(
          { name: data.name, grade: data.grade, group: data.group, date: data.date },
          data,
          { upsert: true },
        )
        .exec();
    } catch (err) {
      console.error(err);
    }
  }

  async deleteByName(name: string): Promise<void> {
    await this.sheduleModel.deleteMany({ name });
  }

  async deleteAll(): Promise<void> {
    await this.sheduleModel.deleteMany();
  }

  async deleteByDate(startTimeStamp: string, endTimeStamp: string): Promise<void> {
    await this.sheduleModel.deleteMany({ date: { $gte: startTimeStamp, $lte: endTimeStamp } });
  }
}
