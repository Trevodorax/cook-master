import { IsEmail, IsIn, IsNotEmpty, IsString } from 'class-validator';

const userTypes = ['client', 'contractor', 'admin'];
export type UserType = (typeof userTypes)[number];

export class SignUpDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsIn(userTypes)
  userType: UserType;
}
