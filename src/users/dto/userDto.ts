import {ApiProperty} from "@nestjs/swagger";
import {PartialType} from "@nestjs/mapped-types";
import {IsString, Length, IsEmail, IsNumber} from 'class-validator'

export class CreateUserDto {
    @ApiProperty({example: 'qwerty@gmail.com', description: 'Электронная почта'})
    @IsString({message: 'Необходима строка'})
    @IsEmail({}, {message: 'Некорректный email'})
    readonly email: string;

    @ApiProperty({example: 'strongest_password', description: 'Пароль'})
    @IsString({message: 'Необходима строка'})
    @Length(4, 50, {message: 'Пароль должены быть длиной не менее 4 символов'})
    readonly password: string;
}
export class UpdateUserDto extends PartialType(CreateUserDto){}

export class TokenUserDto {
    @IsNumber({}, {message: 'Необходимо число'})
    readonly id: number;

    @IsString({message: 'Необходима строка'})
    @IsEmail({}, {message: 'Некорректный email'})
    email: string
}
