import {forwardRef, Module} from '@nestjs/common';
import {TasksService} from './tasks.service';
import {TasksController} from './tasks.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Task} from "./tasks.entity";
import {User} from "../users/users.entity";
import {Blueprint} from "../blueprints/blueprints.entity";
import {AuthzModule} from "../authz/authz.module";

@Module({
    providers: [TasksService],
    controllers: [TasksController],
    imports: [
        TypeOrmModule.forFeature([User, Blueprint, Task]),
        forwardRef(() => AuthzModule)
    ]
})
export class TasksModule {
}
