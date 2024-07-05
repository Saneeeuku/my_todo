import {forwardRef, Module} from '@nestjs/common';
import {UsersController} from './users.controller';
import {UsersService} from './users.service';
import {User} from "./users.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Task} from "../tasks/tasks.entity";
import {AuthzModule} from "../authz/authz.module";
import {Blueprint} from "../blueprints/blueprints.entity";

@Module({
    controllers: [UsersController],
    providers: [UsersService],
    imports: [
        TypeOrmModule.forFeature([User, Blueprint, Task]),
        forwardRef(() => AuthzModule)
    ],
    exports: [UsersService]
})
export class UsersModule {
}
