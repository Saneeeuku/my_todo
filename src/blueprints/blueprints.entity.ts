import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToOne, OneToMany
} from "typeorm"
import {ApiProperty} from "@nestjs/swagger";
import {User} from "../users/users.entity";
import {Task} from "../tasks/task.entity";
import {TasksProgress} from "../tasks/tasks.progress/tasks.progress.entity";

@Entity('blueprints')
export class Blueprint {
    @ApiProperty({example: '123', description: 'Уникальный ID'})
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({example: 'Мой проект', description: 'Название проекта'})
    @Column({nullable: false})
    title!: string;

    @ApiProperty({example: 'Проект по важной задаче', description: 'Описание проекта'})
    @Column({nullable: false})
    description!: string;

    @ApiProperty({example: '2024-07-03T15:22:46.054Z', description: 'Дата создания проекта'})
    @CreateDateColumn({type: 'timestamptz', select: true})
    created_at: Date;

    @UpdateDateColumn({type: 'timestamptz', select: false})
    updated_at: Date;

    @DeleteDateColumn({type: 'timestamptz', select: false})
    deleted_at: Date;

    @ManyToOne(() => User, (user) => user.blueprints,
        {onDelete: 'CASCADE', orphanedRowAction: 'delete'})
    user: User

    @OneToMany(() => TasksProgress, (tProgress) => tProgress.blueprint,
        {cascade: ['remove']})
    tasksProgress: TasksProgress[]

    @OneToMany(() => Task, (tasks) => tasks.blueprint,
        {cascade: ['remove']})
    tasks: Task[]
}