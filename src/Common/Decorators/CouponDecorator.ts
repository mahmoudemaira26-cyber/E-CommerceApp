import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'ValidateCouponDate', async: false })
export class ValidateCouponDate implements ValidatorConstraintInterface {
  validate(value: any, args?: ValidationArguments): Promise<boolean> | boolean {
    const obj = args.object as any;
    const fromDate = new Date(obj.fromDate);
    const toDate = new Date(obj.toDate);
    const nowDate = new Date();
    return fromDate >= nowDate && toDate > fromDate;
  }
  defaultMessage(args?: ValidationArguments): string {
    return `Coupon Date Start Must be Greater Than Or Equal Today & Coupon Date Expire Must Be Greater Than  Coupon Date Start`;
  }
}
