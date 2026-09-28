import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProductRepo } from '../../Repo/ProductRepo.js';
import { CreateCartDTO } from './Cart.DTO.js';
import { CartRepo } from '../../Repo/CartRepo.js';
import { IHUser } from '../../Models/UserModel.js';
import { Types } from 'mongoose';

@Injectable()
export class CartService {
  constructor(
    private _productRepo: ProductRepo,
    private _cartRepo: CartRepo,
  ) {}

  async CreateCart(BodyData: CreateCartDTO, User: IHUser) {
    const { QTY, productId } = BodyData;
    const product = await this._productRepo.FindingOne({
      filter: { _id: productId, stock: { $gte: QTY } },
    });
    if (!product) {
      throw new NotFoundException('Product not Found or Out Of Stock');
    }

    const Cart = await this._cartRepo.FindingOne({
      filter: { createdBy: User._id },
    });
    if (!Cart) {
      const NewCart = await this._cartRepo.Creating({
        data: {
          createdBy: User._id,
          products: [{ productId, QTY, findalPrice: product.price }],
        },
      });
      return NewCart;
    }
    const productExist = Cart.products.find(
      (product) => product.productId.toString() === productId.toString(),
    );
    if (productExist) {
      throw new ConflictException('Products Already Exist In The Cart');
    }
    Cart.products.push({ productId, QTY, findalPrice: product.price });
    await Cart.save();
    return Cart;
  }
  async RemoveProductFromCart(productId: Types.ObjectId, User: IHUser) {
    const product = await this._productRepo.FindingOne({
      filter: { _id: productId },
    });
    if (!product) {
      throw new NotFoundException('Product Not Found');
    }
    const Cart = await this._cartRepo.FindingOne({
      filter: {
        createdBy: User._id,
        'products.productId': productId,
      },
    });
    if (!Cart) {
      throw new NotFoundException('Cart Not Found');
    }

    Cart.products = Cart.products.filter(
      (product) => product.productId.toString() != productId.toString(),
    );
    await Cart.save();
    return Cart;
  }
  async UpdateQTY(User: IHUser, BodyData: CreateCartDTO) {
    const { QTY, productId } = BodyData;

    const Cart = await this._cartRepo.FindingOne({
      filter: {
        createdBy: User._id,
        'products.productId': productId,
      },
    });
    if (!Cart) {
      throw new NotFoundException('Cart Not Found');
    }

    
    Cart.products.find((product) => {
      if (product.productId.toString() == productId.toString()) {
        product.QTY = QTY;
      }
    });


    
    await Cart.save();
    return Cart;
  }
}
