import {forwardRef, Module} from '@nestjs/common';
import {BlueprintsController} from './blueprints.controller';
import {BlueprintsService} from './blueprints.service';
import {User} from "../users/users.entity";
import {Blueprint} from "./blueprints.entity";
import {Task} from "../tasks/tasks.entity";
import {AuthzModule} from "../authz/authz.module";
import {TypeOrmModule} from "@nestjs/typeorm";

@Module({
    controllers: [BlueprintsController],
    providers: [BlueprintsService],
    imports: [
        TypeOrmModule.forFeature([User, Blueprint, Task]),
        forwardRef(() => AuthzModule)
    ],
})
export class BlueprintsModule {
}
