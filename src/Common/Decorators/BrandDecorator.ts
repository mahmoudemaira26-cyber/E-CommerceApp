import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function AtLeastOne(
  requiredFields: string[],
  validationOptions?: ValidationOptions,
) {
  return function (constructor: Function) {
    registerDecorator({
      target: constructor,
      propertyName: '',
      options: validationOptions,
      constraints: requiredFields,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return requiredFields.some((field) => args.object[field]);
        },
        defaultMessage(args: ValidationArguments) {
          return `one of the ${requiredFields.join(' ')} is Requrie`;
        },
      },
    });
  };
}
