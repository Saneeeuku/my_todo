import {forwardRef, Module} from '@nestjs/common';
import {TaskService} from './task.service';
import {TaskController} from './task.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Task} from "./task.entity";
import {User} from "../users/users.entity";
import {Blueprint} from "../blueprints/blueprints.entity";
import {AuthzModule} from "../authz/authz.module";
import {TasksProgress} from "./tasks.progress/tasks.progress.entity";

@Module({
    providers: [TaskService],
    controllers: [TaskController],
    imports: [
        TypeOrmModule.forFeature([User, Blueprint, Task, TasksProgress]),
        forwardRef(() => AuthzModule)
    ]
})
export class TaskModule {
}
