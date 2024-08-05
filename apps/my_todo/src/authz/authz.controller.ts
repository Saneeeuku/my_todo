import {Body, Controller, Post} from '@nestjs/common';
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {UserDto} from "../users/dto/user.dto";
import {AuthzService} from "./authz.service";

@ApiTags('Авторизация')
@Controller('auth')
export class AuthzController {
    constructor(private authzService: AuthzService) {
    }

    @ApiOperation({summary: 'Авторизация пользователя'})
    @ApiResponse({status: 200})
    @Post('/login')
    login(@Body() userDto: UserDto) {
        return this.authzService.login(userDto)
    }

    @ApiOperation({summary: 'Регистрация пользователя'})
    @ApiResponse({status: 200})
    @Post('/register')
    register(@Body() userDto: UserDto) {
        return this.authzService.register(userDto)
    }
}
