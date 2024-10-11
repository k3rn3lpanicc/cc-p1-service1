import { Injectable } from '@nestjs/common';
import {
  Record,
  RecordDocument,
} from './records/schemas/record.schema/record.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateRecordDto } from './records/dtos/create.record.dto';
import { STATE } from './records/enums/state.enum';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Record.name) private recordModel: Model<RecordDocument>,
  ) {}
  checkHealth(): string {
    return 'Service is running';
  }

  async handleUserRequest(email: string, imageUrl: string) {
    const record: CreateRecordDto = {
      email,
      imageUrl,
      resultUrl: '',
      state: STATE.CREATED,
      imageCaption: '',
    };
    const createdRecord = new this.recordModel(record);
    return createdRecord.save();
  }

  async getRequestStatus(requestId: string) {
    const req = await this.recordModel.findOne({ _id: requestId });
    return {
      result: {
        url: req.imageUrl,
        requestId: req._id,
        state: req.state,
        caption: req.imageCaption,
      },
    };
  }
}
