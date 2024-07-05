import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    OneToMany
} from "typeorm"
import {ApiProperty} from "@nestjs/swagger";
import {Blueprint} from "../blueprints/blueprints.entity";
import {Task} from "../tasks/tasks.entity";


@Entity('users')
export class User {
    @ApiProperty({example: '123', description: 'Уникальный ID'})
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({example: 'qwerty@gmail.com', description: 'Электронная почта'})
    @Column({nullable: false})
    email!: string;

    @ApiProperty({example: 'strongest_password', description: 'Пароль'})
    @Column({nullable: false, select: false})
    password!: string;

    @ApiProperty({example: '2024-07-03T15:22:46.054Z', description: 'Дата регистрации'})
    @CreateDateColumn({type: 'timestamptz', select: true})
    created_at: Date;

    @UpdateDateColumn({type: 'timestamptz', select: false})
    updated_at: Date;

    @DeleteDateColumn({type: 'timestamptz', select: false})
    deleted_at: Date;

    @OneToMany(() => Blueprint, (blueprint) => blueprint.user,
        {onUpdate: 'CASCADE', onDelete: 'CASCADE'}
    )
    blueprints: Blueprint[]

    @OneToMany(() => Task, (task) => task.user,
        {onUpdate: 'CASCADE', onDelete: 'CASCADE'}
    )
    tasks: Task[]

}