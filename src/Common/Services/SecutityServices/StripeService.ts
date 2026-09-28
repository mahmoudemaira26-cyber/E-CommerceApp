import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe = new Stripe(process.env.STRIP_SECRET_KEY);
  constructor() {}
  async CreateCheckOutSession({
    customer_email,
    metadata,
    line_items,
    discounts,
  }: {
    customer_email: string;
    metadata?: {};
    line_items: any[];
    discounts?: any[];
  }) {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email,
      metadata,
      success_url: 'http://localhost:3000/Order/Success',
      cancel_url: 'http://localhost:3000/Order/Cancel',
      line_items,
      discounts,
    });
    return session;
  }

  async CreateCoupon(percent_off: number) {
    const coupon = await this.stripe.coupons.create({
      percent_off,
      duration: 'once',
    });
    return coupon;
  }
  async CreateRefundPayment(payment_intent: string) {
    const Refund = await this.stripe.refunds.create({
      payment_intent,
      reason: 'requested_by_customer',
    });
      return Refund
  }
}
