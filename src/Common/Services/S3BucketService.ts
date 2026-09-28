import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  ObjectCannedACL,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import 'multer';
import { Upload } from '@aws-sdk/lib-storage';
import { StorageTypeApproachEnum } from '../Enums/MulterEnum.js';
import { createReadStream } from 'fs';
@Injectable()
export class S3BucketService {
  private BUCKET_NAME: string;
  private APPLICATION_NAME: string;
  private REGION: string;
  private ACCESS_KEY_ID: string;
  private SECRET_ACCESS_KEY: string;
  private _Client: S3Client;
  constructor(private _configService: ConfigService) {
    this.BUCKET_NAME = this._configService.get('BUCKET_NAME') as string;
    this.APPLICATION_NAME = this._configService.get(
      'APPLICATION_NAME',
    ) as string;
    this.REGION = this._configService.get('REGION') as string;
    this.ACCESS_KEY_ID = this._configService.get('ACCESS_KEY_ID') as string;
    this.SECRET_ACCESS_KEY = this._configService.get(
      'SECRET_ACCESS_KEY',
    ) as string;

    this._Client = new S3Client({
      region: this.REGION,
      credentials: {
        accessKeyId: this.ACCESS_KEY_ID,
        secretAccessKey: this.SECRET_ACCESS_KEY,
      },
    });
  }

  async PresignedUrlUploadFile({
    ContentType,
    Path,
    OriginalName,
  }: {
    ContentType: string;
    Path: string;
    OriginalName: string;
  }) {
    const Command = new PutObjectCommand({
      Bucket: this.BUCKET_NAME,
      Key: `${this.APPLICATION_NAME}/${Path}/${randomUUID()}_${OriginalName}`,
      ACL: ObjectCannedACL.private,
      ContentType,
    });

    const Url = await getSignedUrl(this._Client, Command);
    return { Key: Command.input.Key, Url };
  }
  async UploadFile({
    file,
    Path,
  }: {
    file: Express.Multer.File;
    Path: string;
  }) {
    const Command = new PutObjectCommand({
      Bucket: this.BUCKET_NAME,
      Key: `${this.APPLICATION_NAME}/${Path}/${randomUUID()}_${file.originalname}`,
      ACL: ObjectCannedACL.private,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await this._Client.send(Command);
    return Command.input.Key;
  }
  async UploadLargeFile({
    Path,
    file,
    UploadApproach,
  }: {
    Path: string;
    file: Express.Multer.File;
    UploadApproach?: StorageTypeApproachEnum;
  }) {
    const Command = new Upload({
      client: this._Client,
      params: {
        Bucket: this.BUCKET_NAME,
        Key: `${this.APPLICATION_NAME}/${Path}/${randomUUID()}_${file.originalname}`,
        Body:
          UploadApproach == StorageTypeApproachEnum.Memory
            ? file.buffer
            : createReadStream(file.path),
      },

      partSize: 1024 * 1024 * 5,
    });

    Command.on('httpUploadProgress', (progress) => {
      console.log(progress);
      console.log(`Uploaded File ${(progress.loaded / progress.total) * 100}%`);
    });

    const Result = await Command.done();
    return Result.Key;
  }
  async UploadFiles({
    files,
    UploadApproach=StorageTypeApproachEnum.Memory,
    Path,
  }: {
    files: Express.Multer.File[];
    UploadApproach?: StorageTypeApproachEnum;
    Path: string;
  }) {
    const Keys = await Promise.all(
      files.map((file) => {
        return UploadApproach == StorageTypeApproachEnum.Memory
          ? this.UploadFile({ file, Path })
          : this.UploadLargeFile({
              file,
              Path,
              UploadApproach: StorageTypeApproachEnum.Disk,
            });
      }),
    );
    return Keys;
  }
  async GetFile(Key: string) {
    const Command = new GetObjectCommand({ Bucket: this.BUCKET_NAME, Key });
    return await this._Client.send(Command);
  }

  async GetPresignedUrl({
    Key,
    downLoad,
    fileName,
  }: {
    Key: string;
    downLoad: string;
    fileName: string;
  }) {
    const Command = new GetObjectCommand({
      Bucket: this.BUCKET_NAME,
      Key,
      ResponseContentDisposition:
        downLoad == 'true' ? `attachment; fileName=${fileName}` : undefined,
    });

    return await getSignedUrl(this._Client, Command, { expiresIn: 3600 });
  }
  async DeleteFile(Key: string) {
    const Command = new DeleteObjectCommand({ Bucket: this.BUCKET_NAME, Key });
    return await this._Client.send(Command)
  }
  async DeleteFiles(Keys: { Key: string }[]) {
    const Command = new DeleteObjectsCommand({
      Bucket: this.BUCKET_NAME,
      Delete: { Objects: Keys },
    });

    return await this._Client.send(Command);
  }
  async DeleteFilesList(Prefix: string) {
    const Command = new ListObjectsV2Command({
      Bucket: this.BUCKET_NAME,
      Prefix: `${this.APPLICATION_NAME}/${Prefix}`,
    });
  }
}
