import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Types } from 'mongoose';

@ValidatorConstraint({ async: false, name: 'ValidateIDS' })
export class ValidateIDS implements ValidatorConstraintInterface {
  validate(value: string[], args?: ValidationArguments) {
    return (
      value.filter((id) => Types.ObjectId.isValid(id)).length == value.length
    );
  }
  defaultMessage(args?: ValidationArguments): string {
    return `Some Of Ids Is Invalid`;
  }
}
