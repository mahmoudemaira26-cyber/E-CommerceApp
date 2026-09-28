import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { ZodType } from 'zod';

@Injectable()
export class ValidationPipe implements PipeTransform {
  constructor(private _Schema: ZodType) {}
  transform(value: any, metadata: ArgumentMetadata) {
    const { success, data, error } = this._Schema.safeParse(value);
    if (!success) {
      console.log(
        error.issues.map((ele) => {
          return { Path: ele.path, Message: ele.message };
        }),
      );
      throw new BadRequestException('Validation Error');
    }
    return data;
  }
}
