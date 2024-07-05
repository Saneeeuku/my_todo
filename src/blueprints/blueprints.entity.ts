import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToOne
} from "typeorm"
import {ApiProperty} from "@nestjs/swagger";
import {User} from "../users/users.entity";

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

    @ManyToOne(() => User, (user) => user.blueprints)
    user: User
}