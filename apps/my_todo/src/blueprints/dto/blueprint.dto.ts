import {ApiProperty} from "@nestjs/swagger";
import {IsString, MinLength} from "class-validator";
import {PartialType} from "@nestjs/mapped-types";

export class BlueprintDto {
    @ApiProperty({example: 'Мой проект', description: 'Название проекта'})
    @IsString({message: 'Необходима строка'})
    @MinLength(1, {message: `Поле не может быть пустым`})
    readonly title: string;

    @ApiProperty({example: 'Проект по важной задаче', description: 'Описание проекта'})
    @IsString({message: 'Необходима строка'})
    @MinLength(1, {message: 'Поле не может быть пустым'})
    readonly description: string;
}
export class UpdateBlueprintDto extends PartialType(BlueprintDto){}
