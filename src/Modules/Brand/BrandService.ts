import {
  BadRequestException,
  ConflictException,
  Get,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BrandRepo } from '../../Repo/Brand_Repo.js';
import { CreateBrandDTO, UpdateBrandDTO } from './BrandDTO.js';
import { IHUser } from '../../Models/UserModel.js';
import { S3BucketService } from '../../Common/Services/S3BucketService.js';
import { Types } from 'mongoose';
import slugify from 'slugify';
@Injectable()
export class BrandService {
  constructor(
    private _bandRepo: BrandRepo,
    private _s3BuctService: S3BucketService,
  ) {}
  async CreateBrand(
    bodyData: CreateBrandDTO,
    file: Express.Multer.File,
    User: IHUser,
  ) {
    const { name, slug } = bodyData;
    const Brand = await this._bandRepo.FindingOne({ filter: { name } });
    if (Brand) {
      throw new ConflictException('Brand Already Exist');
    }

    const logo = await this._s3BuctService.UploadFile({ file, Path: `Brands` });

    const NewBrand = await this._bandRepo.Creating({
      data: { name, slug, logo, createdBy: User._id },
    });

    if (!NewBrand) {
      await this._s3BuctService.DeleteFile(logo);
      throw new BadRequestException('Fail to Create Brand');
    }
    return NewBrand;
  }
  async GetAllBrands() {
    return await this._bandRepo.Finding({});
  }
  async UpdateBrand(
    id: string,
    BodyData: UpdateBrandDTO,
    file: Express.Multer.File,
    User: IHUser,
  ) {
    const { name, slug } = BodyData;

    const Brand = await this._bandRepo.FindingById({ id });

    if (!Brand) {
      throw new NotFoundException('Brand Not Found');
    }
    if (name && name == Brand.name && !file) {
      throw new BadRequestException('Nothing Changes To Update');
    }
    if (name) {
      const ExistName = await this._bandRepo.FindingOne({
        filter: { name, _id: { $ne: id } },
      });
      if (ExistName) {
        throw new BadRequestException('Brand Already Exists');
      }
    }
    if (file) {
      if (Brand.logo) {
        await this._s3BuctService.DeleteFile(Brand.logo);
      }
      Brand.logo = await this._s3BuctService.UploadFile({
        file,
        Path: `Brands`,
      });
    }

    Brand.name = name;
    Brand.slug = slugify(Brand.name, {
      lower: true,
      trim: true,
      replacement: '-',
    });
    Brand.updatedBy = User._id;
    await Brand.save();
    return Brand;
  }

  async DeleteBrand(id: string) {
    const Brand = await this._bandRepo.FindingById({ id });
    if (!Brand) {
      throw new NotFoundException('Brand Not Found');
    }
    await this._s3BuctService.DeleteFile(Brand.logo)
    await Brand.deleteOne();
  }

  async GetBrandById(id: string) {
    const Brand = await this._bandRepo.FindingById({ id });
    if (!Brand) {
      throw new NotFoundException('Brand Not Found');
    }

    return Brand;
  }
}
