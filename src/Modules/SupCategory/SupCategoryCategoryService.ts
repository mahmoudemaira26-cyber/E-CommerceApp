import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SubCategoryRepo } from '../../Repo/SubCategoryRepo.js';
import {
  CreateSubCategoryDTO,
  UpdateSubCategoryDTO,
} from './SupCategoryCategoryDTO.js';
import { CategoryRepo } from '../../Repo/CategoryRepo.js';
import { S3BucketService } from '../../Common/Services/S3BucketService.js';
import slugify from 'slugify';
import { IHUser } from '../../Models/UserModel.js';
@Injectable()
export class SubCategoryService {
  constructor(
    private _subCategortRepo: SubCategoryRepo,
    private _categoryRepo: CategoryRepo,
    private _s3BucketService: S3BucketService,
  ) {}

  async CreateSubCategory(
    BodyData: CreateSubCategoryDTO,
    file: Express.Multer.File,
    User: IHUser,
  ) {
    const { name, category } = BodyData;
    const SubCategory = await this._subCategortRepo.FindingOne({
      filter: { name },
    });
    if (SubCategory) {
      throw new ConflictException('SubCategory Already Exist');
    }
    const Category = await this._categoryRepo.FindingById({ id: category });
    if (!Category) {
      throw new NotFoundException('Category Not Found');
    }
    let Key: string;
    if (file) {
      Key = await this._s3BucketService.UploadFile({
        file,
        Path: `Category/${category}/SubCategory`,
      });
    }

    const NewSubCategory = await this._subCategortRepo.Creating({
      data: {
        name,
        slug: slugify(name, { lower: true, trim: true, replacement: '-' }),
        image: Key,
        category,
        CreatedBy: User._id,
      },
    });
    return NewSubCategory;
  }
  async UpdateSubCategory(
    id: string,
    file: Express.Multer.File,
    BodyData: UpdateSubCategoryDTO,
    User: IHUser,
  ) {
    const { name, category } = BodyData;
    const SubCategory = await this._subCategortRepo.FindingById({
      id: id,
    });
    if (!SubCategory) {
      throw new NotFoundException('SubCategory Not Found');
    }
    if (file) {
      if (SubCategory.image) {
        await this._s3BucketService.DeleteFile(SubCategory.image);
        SubCategory.image = await this._s3BucketService.UploadFile({
          file,
          Path: `Category/${category}/SubCategory`,
        });
      }
    }
    if (name) {
      const ExistName = await this._subCategortRepo.FindingOne({
        filter: { name, _id: { $ne: id } },
      });
      if (ExistName) {
        throw new ConflictException('SubCategory Name Already Exist');
      }
    }

    SubCategory.name = name;
    SubCategory.slug = slugify(name);
    SubCategory.category = category;
    SubCategory.UpdatedBy = User._id;
    await SubCategory.save();
    return SubCategory;
  }
  async DeleteSubCategory(id: string) {
    const SubCategory = await this._subCategortRepo.FindingById({
      id,
    });
    if (!SubCategory) {
      throw new NotFoundException('SubCategory Not Found');
    }
    if (SubCategory.image) {
      await this._s3BucketService.DeleteFile(SubCategory.image);
    }
    return await SubCategory.deleteOne();
  }
  async GetAllSubCategory() {
    return await this._subCategortRepo.Finding({
      options: { populate: [{ path: 'category' }] },
    });
  }
  async GetByIdSubCategory(id: string) {
    const SubCategory = await this._subCategortRepo.FindingById({
      id,
      options: { populate: [{ path: 'category' }] },
    });
    if (!SubCategory) {
      throw new NotFoundException('SubCategory Not Found');
    }
    return SubCategory;
  }
}
