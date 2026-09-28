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
import { CategoryService } from './CategoryService.js';
import { AuthDoc } from '../../Common/Decorators/AuthDecorator.js';
import { MulterOption } from '../../Common/Utils/Multer.js';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateCategoryDTO, UpdateCategoryDTO } from './CategoryDTO.js';
import { User } from '../../Common/Decorators/UserDecorator.js';
import type { IHUser } from '../../Models/UserModel.js';

@AuthDoc({})
@Controller('Category')
export class CategortController {
  constructor(private _categoryService: CategoryService) {}

  @Post('CreateCategory')
  @UseInterceptors(FileInterceptor('Image', MulterOption({})))
  async CreateCategory(
    @Body() BodyData: CreateCategoryDTO,
    @UploadedFile() file: Express.Multer.File,
    @User() User: IHUser,
  ) {
    return await this._categoryService.CreateCategory(BodyData, file, User);
  }

  @Patch('UpdateCategory/:id')
  @UseInterceptors(FileInterceptor('Image', MulterOption({})))
  async UpdateCategory(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body()
    BodyData: UpdateCategoryDTO,
    @User()
    User: IHUser,
  ) {
    return await this._categoryService.UpdateCategory(id, file, BodyData, User);
  }
  @Delete('DeleteCategory/:id')
  async DeleteCategory(@Param('id') id: string) {
    return await this._categoryService.DeleteCategory(id);
  }

  @Get('GetAllCategory')
  async GetAllCategory() {
    return await this._categoryService.GetAllCategory();
  }
  @Get('GetCategoryById/:id')
  async GetCategoryById(@Param('id') id: string) {
    return await this._categoryService.GetCategoryById(id);
  }
}
