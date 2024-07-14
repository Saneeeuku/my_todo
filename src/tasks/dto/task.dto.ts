import {ApiProperty} from "@nestjs/swagger";
import {IsNumber, IsString, MinLength} from "class-validator";
import {PartialType} from "@nestjs/mapped-types";

export class TaskDto {
    @ApiProperty({example: 'Моя задача', description: 'Название задачи'})
    @IsString({message: "Необходима строка."})
    @MinLength(1, {message: 'Поле не может быть пустым'})
    readonly title: string;

    @ApiProperty({example: 'Добавить новую фитчу', description: 'Описание задачи'})
    @IsString({message: "Необходима строка."})
    @MinLength(1, {message: 'Поле не может быть пустым'})
    readonly description!: string;

    @ApiProperty({example: '1', description: 'Позиция столбца прогресса'})
    @IsNumber({}, {message: "Необходимо число."})
    readonly position!: number;
}

export class UpdateTaskDto extends PartialType(TaskDto){

}