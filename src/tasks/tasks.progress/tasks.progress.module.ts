import {forwardRef, Module} from '@nestjs/common';
import {TasksProgressService} from './tasks.progress.service';
import {TasksProgressController} from './tasks.progress.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Task} from "../task.entity";
import {User} from "../../users/users.entity";
import {Blueprint} from "../../blueprints/blueprints.entity";
import {AuthzModule} from "../../authz/authz.module";
import {TasksProgress} from "./tasks.progress.entity";

@Module({
    providers: [TasksProgressService],
    controllers: [TasksProgressController],
    imports: [
        TypeOrmModule.forFeature([User, Blueprint, TasksProgress]),
        forwardRef(() => AuthzModule)
    ]
})
export class TasksProgressModule {
}
