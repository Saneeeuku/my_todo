import {ApiProperty} from "@nestjs/swagger";
import {IsNumber, IsString, MinLength} from "class-validator";
import {Column} from "typeorm";
import {PartialType} from "@nestjs/mapped-types";

export class TasksProgressDto {
    @ApiProperty({example: 'Сделать/В работе/Готово/...', description: 'Прогресс задачи'})
    @IsString({message: "Необходима строка."})
    @MinLength(1, {message: 'Поле не может быть пустым'})
    readonly title: string;

    @ApiProperty({example: '1', description: 'Позиция столбца прогресса'})
    @IsNumber({}, {message: "Необходимо число."})
    @Column()
    readonly position: number;
}

export class UpdTasksProgressDto extends PartialType(TasksProgressDto) {
}
