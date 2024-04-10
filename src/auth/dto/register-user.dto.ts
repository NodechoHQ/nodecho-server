import { IsEmail, IsStrongPassword, Length } from 'class-validator';

export class RegisterUserDto {
  @Length(1, 255)
  name: string;

  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;
}
