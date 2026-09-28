import { Module } from '@nestjs/common';
import { BrandService } from './BrandService.js';
import { BrandRepo } from '../../Repo/Brand_Repo.js';
import { BrandModel } from '../../Models/BrandModel.js';
import { BrandController } from './BrandController.js';

@Module({
  controllers: [BrandController],
  exports: [],
  imports: [BrandModel],
  providers: [BrandService,BrandRepo],
})
export class BrandModule {}
