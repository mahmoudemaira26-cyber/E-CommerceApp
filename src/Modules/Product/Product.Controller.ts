import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './Product.Service.js';
import { AuthDoc } from '../../Common/Decorators/AuthDecorator.js';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { MulterOption } from '../../Common/Utils/Multer.js';
import { CreateProductDTO, ID_DTO, UpdateProductDTO } from './Product.DTO.js';
import { User } from '../../Common/Decorators/UserDecorator.js';
import type { IHUser } from '../../Models/UserModel.js';
import { Types } from 'mongoose';

@AuthDoc({})
@Controller('Product')
export class ProductController {
  constructor(private _ProductService: ProductService) {}
  @Post('CreateProduct')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'mainImage', maxCount: 1 },
        { name: 'subImage', maxCount: 5 },
      ],
      MulterOption({}),
    ),
  )
  async CreateProduct(
    @UploadedFiles()
    files: {
      mainImage: Express.Multer.File[];
      subImage: Express.Multer.File[];
    },
    @Body() BodyData: CreateProductDTO,
    @User() User: IHUser,
  ) {
    return await this._ProductService.CreateProduct(BodyData, files, User);
  }

  @Patch('UpdateProduct/:id')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'mainImage', maxCount: 1 },
        { name: 'subImage', maxCount: 5 },
      ],
      MulterOption({}),
    ),
  )
  async UpdateProduct(
    @Param() Param: ID_DTO,
    @Body() BodyData: UpdateProductDTO,
    @UploadedFiles()
    files: {
      mainImage: Express.Multer.File[];
      subImage: Express.Multer.File[];
    },
    @User() User: IHUser,
  ) {
    return await this._ProductService.UpdateProduct(
      Param.id,
      BodyData,
      files,
      User,
    );
  }
  @Get('GetAllProduct')
  async GetAllProduct() {
    return await this._ProductService.GetAllProduct();
  }
  @Get('GetByIdProduct/:id')
  async GetByIdProduct(@Param('id') id: string) {
    return await this._ProductService.GetByIdProduct(id);
  }
  @Delete('DeleteProduct/:id')
  async DeleteProduct(@Param('id') id: string) {
    return await this._ProductService.DeleteProduct(id);
  }
  @Patch('AddProductToWishList/:id')
  async AddProductToWishList(@Param("id") id: Types.ObjectId, @User() User: IHUser) {
    return await this._ProductService.AddProductToWishList(id, User);
  }
}
