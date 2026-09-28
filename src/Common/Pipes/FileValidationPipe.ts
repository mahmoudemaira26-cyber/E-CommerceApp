import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

export const AllowFileFormates = {
  Img: ['image/png', 'image/jpeg','image/jpg'],
  Pdf: ['application/pdf'],
};
@Injectable()
export class FileValidationPipe implements PipeTransform {
  constructor(private AllowFileFormates: string[]) {}
  transform(value: any, metadata: ArgumentMetadata) {
  console.log(value);
  
    for(const file of value){

      if (!this.AllowFileFormates.includes(file.mimetype)) {
      throw new BadRequestException('Invalid File Type');
    }
    }
    
    return value;
  }
}
