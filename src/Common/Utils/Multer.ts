import multer from 'multer';
import { StorageTypeApproachEnum } from '../Enums/MulterEnum.js';
import { tmpdir } from 'os';
import { randomUUID } from 'crypto';
import { BadRequestException } from '@nestjs/common';
import { AllowFileFormates } from '../Pipes/FileValidationPipe.js';

export function fileFilter(AllowFormates: string[]) {
  return (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    if (!AllowFormates.includes(file.mimetype)) {
      return cb(new BadRequestException('Invalid File Type'), false);
    }
    return cb(null, true);
  };
}

export function MulterOption({
  UploadApproach = StorageTypeApproachEnum.Memory,
  AllowFormates = AllowFileFormates.Img,
  fileSize = 5,
}: {
  UploadApproach?: StorageTypeApproachEnum;
  AllowFormates?: string[];
  fileSize?: number;
}) {
  const storage =
    UploadApproach == StorageTypeApproachEnum.Memory
      ? multer.memoryStorage()
      : multer.diskStorage({
          destination(req, file, cb) {
            cb(null, tmpdir());
          },
          filename(req, file, cb) {
            cb(null, `${randomUUID()}_${file.originalname}`);
          },
        });
  return {
    storage,
    fileFilter: fileFilter(AllowFormates),
    limits: { fileSize: fileSize * 1024 * 1024 },
  };
}
