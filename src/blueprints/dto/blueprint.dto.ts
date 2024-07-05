import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsString, Length} from "class-validator";

export class BlueprintDto {
    @ApiProperty({example: 'Мой проект', description: 'Название проекта'})
    @IsString({message: 'Необходима строка'})
    readonly title: string;

    @ApiProperty({example: 'Проект по важной задаче', description: 'Описание проекта'})
    @IsString({message: 'Необходима строка'})
    readonly description: string;
}