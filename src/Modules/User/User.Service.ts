import { Injectable } from '@nestjs/common';
import { S3BucketService } from '../../Common/Services/S3BucketService.js';
import { IHUser } from '../../Models/UserModel.js';
import { UserRepo } from '../../Repo/User_Repo.js';
import { Types } from 'mongoose';
import { RedisService } from '../../Common/Services/RedisService.js';
import { JwtPayload } from 'jsonwebtoken';

@Injectable()
export class UserService {
  constructor(
    private _s3BucketService: S3BucketService,
    private _userRepo: UserRepo,
    private _rediseService: RedisService,
  ) {}

  async UploadFilePres(bodyData: any, User: IHUser) {
    const { Key, Url } = await this._s3BucketService.PresignedUrlUploadFile({
      ContentType: bodyData.ContentType,
      OriginalName: bodyData.OriginalName,
      Path: `Users/${User._id}/ProfilePics`,
    });
    return { Key, Url };
  }

  async UploadCoverPic(
    files: Express.Multer.File[],

    User: IHUser,
  ) {
    const key = await this._s3BucketService.UploadFiles({
      files,
      Path: `User/$${User._id}/CoverPics`,
    });
    if (User.CoverPic.length > 0) {
      await Promise.all(
        User.CoverPic.map((CoverPic) => {
          return this._s3BucketService.DeleteFile(CoverPic);
        }),
      );
    }

    User.CoverPic = key;
    User.save();
    return key;
  }
  async logOut(
    logOutOption: string,
    UserId: string|Types.ObjectId,
    token: JwtPayload,
  ) {
    if (logOutOption == 'All') {
      await this._userRepo.FindingOneAndUpdate({
        filter: { _id: UserId },
        update: { ChangeCreditTime: new Date() },
      });
    } else {
      await this._rediseService.Setting({
        key: this._rediseService.BlackListKeys({
          TokenId: token.jti,
          UserId: UserId,
        }),
        value: token.jti,
        EXvalue: 60 * 60 * 24 * 365 - (Date.now() / 1000 - token.iat),
      });
    }
  }
}
