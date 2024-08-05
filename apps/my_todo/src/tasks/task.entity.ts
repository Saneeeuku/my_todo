import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToOne,
} from "typeorm"
import { ApiProperty } from "@nestjs/swagger";
import { User } from "../users/users.entity";
import {Blueprint} from "../blueprints/blueprints.entity";
import {TasksProgress} from "./tasks.progress/tasks.progress.entity";

@Entity('tasks')
export class Task {
    @ApiProperty({example: '123', description: 'Уникальный ID'})
    @PrimaryGeneratedColumn()
    id!: number;

    @ApiProperty({example: 'Моя задача', description: 'Название задачи'})
    @Column({nullable: false})
    title!: string;

    @ApiProperty({example: 'Добавить новую фитчу', description: 'Описание задачи'})
    @Column({nullable: false})
    description!: string;

    @ApiProperty({example: '1', description: 'Позиция в столбце прогресса'})
    @Column({nullable: false})
    position!: number;

    @ApiProperty({example: '2024-07-03T15:22:46.054Z', description: 'Дата создания'})
    @CreateDateColumn({type: 'timestamptz', select: true})
    created_at: Date;

    @UpdateDateColumn({type: 'timestamptz', select: false})
    updated_at: Date;

    @DeleteDateColumn({type: 'timestamptz', select: false})
    deleted_at: Date;

    @ManyToOne(() => User, (user) => user.tasks,
        {onDelete: 'CASCADE', orphanedRowAction: 'delete'})
    user:  User

    @ManyToOne(() => Blueprint, (blueprint) => blueprint.tasks,
        {onDelete: 'CASCADE', orphanedRowAction: 'delete'})
    blueprint:  Blueprint

    @ManyToOne(() => TasksProgress, (tProgress) => tProgress.tasks,
        {onDelete: 'CASCADE', orphanedRowAction: 'delete'})
    progress: TasksProgress
}