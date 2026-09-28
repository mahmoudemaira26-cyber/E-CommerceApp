import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ async: false, name: 'MathConfirm' })
export class ValidateTwoFeilds implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    return value == args.object[args.constraints[0]];
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args.property} Deosn.t Match ${args.constraints[0]}`;
  }
}

export function IsMatch(
  constraints: string[],
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints,
      validator: ValidateTwoFeilds,
    });
  };
}
/**
 * 
 * {
  targetName: 'SignInDTO',
  property: 'CPassward',
  object: SignInDTO {
    Email: 'm.emaira@yahoo.com',
    Passward: 'Mahmmoud123!@#',
    FName: 'Mahmoud',
    LName: 'Emaira',
    CEmail: false,
    CPassward: 'Mahmmoud123!@#',
    Gender: 1,
    Phone: '+201117957825',
    Providor: 0,
    Role: 1,
    ProfilePic: undefined,
    CoverPic: undefined,
    ChangeCreditTime: undefined,
    DeletedAt: undefined,
    Age: 30
  },
  value: 'Mahmmoud123!@#',
  constraints: [ 'Passward' ]
}
Mahmmoud123!@#

 */
