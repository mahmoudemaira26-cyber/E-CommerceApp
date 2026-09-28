import { HttpException, Injectable, NotFoundException } from '@nestjs/common';

import { CouponRepo } from '../../Repo/CouponRepo.js';
import { CreateOrderDTO } from './OrderDTO.js';
import { IHUser } from '../../Models/UserModel.js';
import { CartRepo } from '../../Repo/CartRepo.js';
import { ProductRepo } from '../../Repo/ProductRepo.js';
import { OrderRepo } from '../../Repo/OrderRepo.js';
import {
  paymentMethodEnum,
  paymentStatusEnum,
} from '../../Common/Enums/OderEnum.js';
import { Types } from 'mongoose';
import { StripeService } from '../../Common/Services/SecutityServices/StripeService.js';

@Injectable()
export class OrderService {
  constructor(
    private readonly _couponRepo: CouponRepo,
    private readonly _cartRepo: CartRepo,
    private readonly _productRepo: ProductRepo,
    private readonly _orderRepo: OrderRepo,
    private readonly _stripeService: StripeService,
  ) {}

  async CreateOrder(BodyData: CreateOrderDTO, User: IHUser) {
    const { address, couponCode, paymenMethod, phone } = BodyData;
    let coupon: any;

    if (couponCode) {
      coupon = await this._couponRepo.FindingOne({
        filter: {
          code: couponCode.toLowerCase(),
          UsedBy: { $nin: [User._id] },
        },
      });

      if (!coupon) {
        throw new NotFoundException('Coupon Not Found Or Used Before');
      }
    }
    const Cart = await this._cartRepo.FindingOne({
      filter: { createdBy: User._id },
    });
    if (!Cart || !Cart.products.length) {
      throw new NotFoundException('Cart Not Found or Empty');
    }

    for (const product of Cart.products) {
      const ProductExist = await this._productRepo.FindingOne({
        filter: { _id: product.productId, stock: { $gte: product.QTY } },
      });
      if (!ProductExist) {
        throw new NotFoundException(
          `Product Not Found Or Out Of Stock ${ProductExist}`,
        );
      }
    }
    const Order = await this._orderRepo.Creating({
      data: {
        userId: User._id,
        cart: Cart,
        couponCode: couponCode ? coupon._id : undefined,
        totalPrice: couponCode
          ? Cart.subTotal - Cart.subTotal * (coupon.amount / 100)
          : Cart.subTotal,
        phone,
        address,
        paymenMethod,
        paymentStatus:
          paymenMethod == paymentMethodEnum.Cash
            ? paymentStatusEnum.Paid
            : paymentStatusEnum.Painding,
      },
    });
    if (!Order) {
      throw new HttpException('Fail To Create Order', 500);
    }
    for (const product of Cart.products) {
      await this._productRepo.FindingOneAndUpdate({
        filter: { _id: product.productId },
        update: { $inc: { stock: -product.QTY } },
      });
    }
    if (couponCode) {
      coupon = await this._couponRepo.FindingOneAndUpdate({
        filter: { code: couponCode.toLowerCase() },
        update: { $push: { UsedBy: User._id } },
      });
      if (!coupon) {
        throw new NotFoundException('Coupon Not Found Or Used Before');
      }
    }
    if (paymenMethod == paymentMethodEnum.Cash) {
      await this._cartRepo.FindingOneAndUpdate({
        filter: { createdBy: User._id },
        update: { products: [] },
      });
    }

    return Order;
  }
  async PayWithStripe(id: Types.ObjectId, User: IHUser) {
    const Order = await this._orderRepo.FindingOne({
      filter: {
        _id: id,
        paymentStatus: paymentStatusEnum.Painding,
        paymenMethod: paymentMethodEnum.Card,
      },
      options: {
        populate: [
          { path: 'cart', populate: [{ path: 'products.productId' }] },
          { path: 'couponCode' },
        ],
      },
    });

    if (!Order) {
      throw new NotFoundException('Order Not Found');
    }
    let coupon: any;
    if (Order?.couponCode) {
      coupon = await this._stripeService.CreateCoupon(
        Order.couponCode['amount'],
      );
    }
    const session = await this._stripeService.CreateCheckOutSession({
      customer_email: User.Email,
      metadata: { orderId: Order._id.toString() },
      line_items: Order.cart['products'].map((product: any) => {
        return {
          price_data: {
            currency: 'usd',
            product_data: { name: product.productId.name },
            unit_amount: product.findalPrice * 100,
          },
          quantity: product.QTY,
        };
      }),
      ...(coupon && { discounts: [{ coupon: coupon.id }] }),
    });

    return session.url;
  }
  async webhook(BodyData: any) {
    const orderId = BodyData.data.object.metadata.orderId;
    const paymentIntent = BodyData.data.object.payment_intent;
    return await this._orderRepo.FindingOneAndUpdate({
      filter: { _id: orderId },
      update: {
        paymentStatus: paymentStatusEnum.Paid,
        paymentIntent,
        orderChanges: { paidAt: new Date() },
      },
    });
  }
  async RefundPayment(id: Types.ObjectId) {
    const Order = await this._orderRepo.FindingOneAndUpdate({
      filter: { _id: id, paymentStatus: { $in: [paymentStatusEnum.Paid] } },
      update: {
        paymentStatus: paymentStatusEnum.Refund,
        orderChanges: { refundAt: new Date() },
      },
    });
    if (!Order) {
      throw new NotFoundException('Order Not Found');
    }
    await this._stripeService.CreateRefundPayment(Order.paymentIntent);
    return Order;
  }
}
