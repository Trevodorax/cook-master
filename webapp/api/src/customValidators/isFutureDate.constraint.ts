import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsFutureDate', async: false })
export class IsFutureDateConstraint implements ValidatorConstraintInterface {
  validate(date: Date) {
    const currentDate = new Date();
    return date > currentDate;
  }

  defaultMessage() {
    return 'The date must be in the future.';
  }
}
