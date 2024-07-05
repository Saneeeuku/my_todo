import {ApiProperty} from "@nestjs/swagger";
import {IsString, Length, IsEmail} from 'class-validator'

export class UserDto {
    @ApiProperty({example: 'qwerty@gmail.com', description: 'Электронная почта'})
    @IsString({message: 'Необходима строка'})
    @IsEmail({}, {message: 'Некорректный email'})
    readonly email: string;

    @ApiProperty({example: 'strongest_password', description: 'Пароль'})
    @IsString({message: 'Необходима строка'})
    @Length(4, 15, {message: 'Пароль должены быть длиной 4-15 символов'})
    readonly password: string;
}