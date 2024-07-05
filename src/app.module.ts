import { Module } from "@nestjs/common";
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { User } from "./users/users.entity";
import { TasksModule } from './tasks/tasks.module';
import { Task } from "./tasks/tasks.entity";
import { AuthzModule } from './authz/authz.module';
import { BlueprintsModule } from './blueprints/blueprints.module';
import {Blueprint} from "./blueprints/blueprints.entity";

@Module({
    controllers: [],
    providers: [],
    imports: [
        ConfigModule.forRoot({
            envFilePath: `.${process.env.NODE_ENV}.env`
        }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.POSTGRES_HOST,
            port: Number(process.env.POSTGRES_PORT),
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DATABASE,
            entities: [User, Blueprint, Task],
            synchronize: Boolean(process.env.POSTGRES_SYNC),
            autoLoadEntities: true,
        }),
        UsersModule,
        TasksModule,
        AuthzModule,
        BlueprintsModule,
    ]
})
export class AppModule {}