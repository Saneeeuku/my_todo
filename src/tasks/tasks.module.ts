import {Module} from '@nestjs/common';
import {TasksService} from './tasks.service';
import {TasksController} from './tasks.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Task} from "./tasks.entity";
import {User} from "../users/users.entity";

@Module({
    providers: [TasksService],
    controllers: [TasksController],
    imports: [
        TypeOrmModule.forFeature([Task, User]),
    ]
})
export class TasksModule {
}
