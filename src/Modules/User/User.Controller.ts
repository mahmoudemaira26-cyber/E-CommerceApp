import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UploadedFiles,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { User } from '../../Common/Decorators/UserDecorator.js';
import type { IHUser } from '../../Models/UserModel.js';
import { AuthDoc } from '../../Common/Decorators/AuthDecorator.js';
import {
  AllowFileFormates,
  FileValidationPipe,
} from '../../Common/Pipes/FileValidationPipe.js';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { MulterOption } from '../../Common/Utils/Multer.js';
import { UserService } from './User.Service.js';
import { StorageTypeApproachEnum } from '../../Common/Enums/MulterEnum.js';
import type { JwtPayload } from 'jsonwebtoken';
import type{ IRequestAuth } from '../../Common/InterFace/RequestType.js';

@AuthDoc({})
@Controller('User')
export class UserController {
  constructor(private _userService: UserService) {}
  @Get('GetUser')
  GetUser(@User() user: IHUser) {
    return user;
  }

  @UseInterceptors(FileInterceptor('file', MulterOption({})))
  @Post('UploadFilePresigned')
  async UploadFilePresigned(@Body() bodyData: any, @User() User: IHUser) {
    const result = await this._userService.UploadFilePres(bodyData, User);
    return result;
  }

  //   @UsePipes(new FileValidationPipe(AllowFileFormates.Img))
  @UseInterceptors(
    FilesInterceptor(
      'files',
      5,
      MulterOption({ UploadApproach: StorageTypeApproachEnum.Disk }),
    ),
  )
  @Post('UploadCoverPic')
  async UploadCoverPic(
    @UploadedFiles(new FileValidationPipe(AllowFileFormates.Img))
    files: Express.Multer.File[],
    @User() User: IHUser,
  ) {
    const result = await this._userService.UploadCoverPic(files, User);
    return result;
  }
  async logOut(
    @Body('logOutOption') logOutOption: string,
    @User() User: IHUser,
    @Req() req:IRequestAuth,
  ) {



    return await this._userService.logOut(logOutOption, User._id, req.PayLoad);
  }
}
