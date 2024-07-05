import {forwardRef, Module} from '@nestjs/common';
import {AuthzController} from './authz.controller';
import {AuthzService} from './authz.service';
import {UsersModule} from "../users/users.module";
import {JwtModule} from '@nestjs/jwt';
import {BlueprintsModule} from "../blueprints/blueprints.module";

@Module({
    controllers: [AuthzController],
    providers: [AuthzService],
    imports: [
        forwardRef(() => UsersModule),
        forwardRef(() => BlueprintsModule),
        JwtModule.register({
            secret: process.env.SECRET_KEY || 'none',
            signOptions: {
                expiresIn: '24h'
            }
        })
    ],
    exports: [
        AuthzService,
        JwtModule
    ]
})
export class AuthzModule {
}
