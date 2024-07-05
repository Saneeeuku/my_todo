import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne} from "typeorm"
import { ApiProperty } from "@nestjs/swagger";
import { User } from "../users/users.entity";

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

    @ApiProperty({example: '2024-07-03T15:22:46.054Z', description: 'Дата создания'})
    @CreateDateColumn({type: 'timestamptz', select: true})
    created_at: Date;

    @UpdateDateColumn({type: 'timestamptz', select: false})
    updated_at: Date;

    @DeleteDateColumn({type: 'timestamptz', select: false})
    deleted_at: Date;

    // @ManyToOne(() => User, (user) => user.tasks)
    // user:  User
}