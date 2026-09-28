import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AuthDoc } from '../../Common/Decorators/AuthDecorator.js';
import { SubCategoryService } from './SupCategoryCategoryService.js';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterOption } from '../../Common/Utils/Multer.js';
import {
  CreateSubCategoryDTO,
  UpdateSubCategoryDTO,
} from './SupCategoryCategoryDTO.js';
import { User } from '../../Common/Decorators/UserDecorator.js';
import type { IHUser } from '../../Models/UserModel.js';

@AuthDoc({})
@Controller('SubCategory')
export class SubCategortController {
  constructor(private _subCategoryService: SubCategoryService) {}

  @Post('CreateSubCategory')
  @UseInterceptors(FileInterceptor('Image', MulterOption({})))
  async CreateSubCategory(
    @Body() BodyData: CreateSubCategoryDTO,
    @UploadedFile() file: Express.Multer.File,
    @User() User: IHUser,
  ) {
    return await this._subCategoryService.CreateSubCategory(
      BodyData,
      file,
      User,
    );
  }
  @Patch('UpdateSubCategory/:id')
  @UseInterceptors(FileInterceptor('Image', MulterOption({})))
  async UpdateSubCategory(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() BodyData: UpdateSubCategoryDTO,
    @User() User: IHUser,
  ) {
    return await this._subCategoryService.UpdateSubCategory(
      id,
      file,
      BodyData,
      User,
    );
  }
  @Delete('DeleteSubCategory/:id')
  async DeleteSubCategory(@Param('id') id: string) {
    return await this._subCategoryService.DeleteSubCategory(id);
  }

  @Get('GetAllSubCategory')
  async GetAllSubCategory() {
    return await this._subCategoryService.GetAllSubCategory();
  }
  @Get('GetByIdSubCategory/:id')
  async GetByIdSubCategory(@Param('id') id: string) {
    return await this._subCategoryService.GetByIdSubCategory(id);
  }
}
