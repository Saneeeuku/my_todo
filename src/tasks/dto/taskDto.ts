import {ApiProperty} from "@nestjs/swagger";
import {IsString} from "class-validator";

export class TaskDto {
    @ApiProperty({example: 'Моя задача', description: 'Название задачи'})
    @IsString({message: "Необходима строка."})
    readonly title: string;

    @ApiProperty({example: 'Добавить новую фитчу', description: 'Описание задачи'})
    @IsString({message: "Необходима строка."})
    readonly description: string;
}