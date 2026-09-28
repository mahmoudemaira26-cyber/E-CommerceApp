import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDTO, UpdateCategoryDTO } from './CategoryDTO.js';
import { CategoryRepo } from '../../Repo/CategoryRepo.js';
import { Types } from 'mongoose';
import { BrandRepo } from '../../Repo/Brand_Repo.js';
import { S3BucketService } from '../../Common/Services/S3BucketService.js';
import { IHUser } from '../../Models/UserModel.js';
import slugify from 'slugify';
@Injectable()
export class CategoryService {
  constructor(
    private _categoryRepo: CategoryRepo,
    private _brandRepo: BrandRepo,
    private _s3BucketService: S3BucketService,
  ) {}

  async CreateCategory(
    BodyData: CreateCategoryDTO,
    file: Express.Multer.File,
    User: IHUser,
  ) {
    const { brand, name } = BodyData;

    const CategoryIsExist = await this._categoryRepo.FindingOne({
      filter: { name },
    });
    if (CategoryIsExist) {
      throw new ConflictException('Category Name Already Exist');
    }
    const UnDublicateBrands = ([...new Set(brand || [])] as any).map((id) =>
      Types.ObjectId.createFromHexString(id),
    );
    const ExistBrands = await this._brandRepo.Finding({
      filter: { _id: { $in: UnDublicateBrands } },
    });

    if (brand && ExistBrands.length != UnDublicateBrands.length) {
      throw new NotFoundException('Some Brands Not Found');
    }
    const Key = await this._s3BucketService.UploadFile({
      file,
      Path: 'Categories',
    });

    return await this._categoryRepo.Creating({
      data: {
        name,
        brand: UnDublicateBrands,
        Image: Key,
        CreatedBy: User._id,
        image: Key,
      },
    });
  }

  async UpdateCategory(
    id: string,
    file: Express.Multer.File,
    BodyData: UpdateCategoryDTO,
    User: IHUser,
  ) {
    const { name } = BodyData;
    const Category = await this._categoryRepo.FindingOne({
      filter: { id: id },
    });

    if (!Category) {
      throw new NotFoundException('Category Not Found');
    }
    if (file) {
      if (Category.image) {
        await this._s3BucketService.DeleteFile(Category.image);
        const Key = await this._s3BucketService.UploadFile({
          file,
          Path: `Categories`,
        });
        Category.image = Key;
      }
    }
    if (BodyData.name) {
      const nameExist = await this._categoryRepo.FindingOne({
        filter: { name, _id: { $ne: id } },
      });
      if (nameExist) {
        throw new ConflictException('Category Name Already Exist');
      }
    }
    Category.name = name;
    Category.slug = slugify(name, {
      lower: true,
      trim: true,
      replacement: '-',
    });

    Category.UpdatedBy = User._id;
    await Category.save();
    return Category;
  }
  async DeleteCategory(id: string) {
    const Category = await this._categoryRepo.FindingOne({
      filter: { id: id },
    });

    if (!Category) {
      throw new NotFoundException('Category Not Found');
    }
    await this._s3BucketService.DeleteFile(Category.image);
    await Category.deleteOne();
  }
  async GetAllCategory() {
    return await this._categoryRepo.Finding({})
  }
  async GetCategoryById(id:string) {
     const Category = await this._categoryRepo.FindingOne({
      filter: { id: id },
    });

    if (!Category) {
      throw new NotFoundException('Category Not Found');
    }
    return Category
  }
}
