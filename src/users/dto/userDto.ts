import {ApiProperty} from "@nestjs/swagger";
import {PartialType} from "@nestjs/mapped-types";
import {IsString, Length, IsEmail, IsNumber} from 'class-validator'
//import {Type} from 'class-transformer'

export class CreateUserDto {
    @ApiProperty({example: 'qwerty@gmail.com', description: 'Электронная почта'})
    @IsString({message: 'Необходима строка'})
    @IsEmail({}, {message: 'Некорректный email'})
    readonly email: string;

    @ApiProperty({example: 'strongest_password', description: 'Пароль'})
    @IsString({message: 'Необходима строка'})
    @Length(4, 15, {message: 'Пароль должены быть длиной 4-15 символов'})
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
