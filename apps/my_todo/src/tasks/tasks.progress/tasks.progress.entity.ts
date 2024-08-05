import {Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne} from "typeorm"
import { ApiProperty } from "@nestjs/swagger";
import { Task } from "../task.entity";
import {User} from "../../users/users.entity";
import {Blueprint} from "../../blueprints/blueprints.entity";
@Entity('taskProgress')
export class TasksProgress {

    @ApiProperty({example: '123', description: 'Уникальный ID'})
    @PrimaryGeneratedColumn()
    id!: number;

    @ApiProperty({example: 'Сделать/В работе/Готово/...', description: 'Прогресс задачи'})
    @Column({nullable: false})
    title!: string;

    @ApiProperty({example: '1', description: 'Позиция столбца прогресса'})
    @Column()
    position!: number;

    @ApiProperty({example: '1', description: 'ID задачи'})
    @OneToMany(() => Task, (task) => task.progress,
        {cascade: ['remove', "update"]})
    tasks: Task[]

    @ManyToOne(() => Blueprint, (blueprint) => blueprint.tasks,
        {onDelete: 'CASCADE', orphanedRowAction: 'delete'})
    blueprint:  Blueprint

    @ManyToOne(() => User, (user) => user.tasksProgress,
        {onDelete: 'CASCADE', orphanedRowAction: 'delete'})
    user: User
}