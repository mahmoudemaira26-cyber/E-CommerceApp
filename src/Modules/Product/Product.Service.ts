import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProductRepo } from '../../Repo/ProductRepo.js';
import { CreateProductDTO, UpdateProductDTO } from './Product.DTO.js';
import { S3BucketService } from '../../Common/Services/S3BucketService.js';
import slugify from 'slugify';
import { IHUser } from '../../Models/UserModel.js';
import { Types } from 'mongoose';
import { UserRepo } from '../../Repo/User_Repo.js';
@Injectable()
export class ProductService {
  constructor(
    private _productRepo: ProductRepo,
    private _s3BucketService: S3BucketService,
    private _userRepo: UserRepo,
  ) {}

  async CreateProduct(
    BodyData: CreateProductDTO,
    files: {
      mainImage: Express.Multer.File[];
      subImage: Express.Multer.File[];
    },
    User: IHUser,
  ) {
    let {
      name,
      brand,
      category,
      Subcategory,
      price,
      discount,
      descreption,
      stock,
    } = BodyData;

    const product = await this._productRepo.FindingOne({ filter: { name } });
    if (product) {
      throw new ConflictException('Product Already Exist');
    }
    const [Brand, Category, SubCategory] = await Promise.all([
      this._productRepo.checkBrand(brand),
      this._productRepo.checkCategory(category),
      this._productRepo.checkSubCategory(Subcategory, category),
    ]);
    if (!Brand) {
      throw new NotFoundException('Brand Not Found');
    }
    if (!Category) {
      throw new NotFoundException('Category Not Found');
    }
    if (!SubCategory) {
      throw new NotFoundException('SubCategory Not Found');
    }

    price = price - price * ((discount || 0) / 100);
    console.log(price);

    const MainPic = await this._s3BucketService.UploadFile({
      file: files.mainImage[0],
      Path: `${name}/MainImage`,
    });
    const SubPic = await this._s3BucketService.UploadFiles({
      files: files.subImage,
      Path: `${name}/SubImages`,
    });
    const NewProduct = await this._productRepo.Creating({
      data: {
        name,
        slug: slugify(name),
        descreption,
        brand,
        price,
        category,
        Subcategory,
        discount,
        stock,
        mainImage: MainPic,
        subImage: SubPic,
        createdBy: User._id,
      },
    });

    return NewProduct;
  }

  async UpdateProduct(
    id: Types.ObjectId,
    BodyData: UpdateProductDTO,
    files: {
      mainImage: Express.Multer.File[];
      subImage: Express.Multer.File[];
    },
    User: IHUser,
  ) {
    let {
      name,
      brand,
      category,
      Subcategory,
      price,
      discount,
      descreption,
      stock,
    } = BodyData;

    const Product = await this._productRepo.FindingById({ id: id });
    if (!Product) {
      throw new NotFoundException('Product Not Found');
    }
    if (brand) {
      const BrandExist = await this._productRepo.checkBrand(brand);
      if (!BrandExist) {
        throw new NotFoundException('Brand Not Found');
      }
    }
    if (category) {
      const CategoryExist = await this._productRepo.checkCategory(category);
      if (!CategoryExist) {
        throw new NotFoundException('Category Not Found');
      }
    }
    if (Subcategory) {
      const SubCategoryExist =
        await this._productRepo.checkSubCategory(Subcategory);
      if (!SubCategoryExist) {
        throw new NotFoundException('Subcategory Not Found');
      }
    }

    if (price && discount) {
      price = price - price * (discount / 100);
    } else if (price) {
      price = price - price * (Product.discount / 100);
    } else if (discount) {
      Product.price = Product.price - Product.price * (discount / 100);
    }
    let mainImage: string;
    if (files?.mainImage?.length) {
      mainImage = await this._s3BucketService.UploadFile({
        file: files.mainImage[0],
        Path: `${name}/MainImage`,
      });
    }
    let subImage: string[];
    if (files?.subImage?.length) {
      subImage = await this._s3BucketService.UploadFiles({
        files: files.mainImage,
        Path: `${name}/SubImages`,
      });
    }
    const ProductUpdated = await this._productRepo.FindingOneAndUpdate({
      filter: { _id: id },
      update: { ...BodyData, mainImage, subImage },
    });
    return ProductUpdated;
  }

  async GetAllProduct() {
    return await this._productRepo.Finding({});
  }
  async GetByIdProduct(id: string) {
    const product = await this._productRepo.FindingById({ id });
    if (!product) {
      throw new NotFoundException('product Not Found');
    }
    return product;
  }
  async DeleteProduct(id: string) {
    const product = await this._productRepo.FindingById({ id });
    if (!product) {
      throw new NotFoundException('product Not Found');
    }
    return await product.deleteOne();
  }
  async AddProductToWishList(id: Types.ObjectId, User: IHUser) {
    const Product = await this._productRepo.checkProduct(id);
    if (!Product) {
      throw new NotFoundException('Product Not Found');
    }
    let IsExist: Boolean = false;
    const productExist = await this._userRepo.FindingOneAndUpdate({
      filter: { _id: User._id, WishList: { $in: [id] } },
      update: { $pull: { WishList: id } },
    });
    if (!productExist) {
      await this._userRepo.FindingOneAndUpdate({
        filter: { _id: User._id },
        update: { $addToSet: { WishList: id } },
      });
      IsExist = true;
    }
    return IsExist == true
      ? { Message: 'Product Added To WishList' }
      : { Message: 'Product Deleted From WishList' };
  }
}
