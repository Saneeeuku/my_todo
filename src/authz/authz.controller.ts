import {Body, Controller, Post, UsePipes} from '@nestjs/common';
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {UserDto} from "../users/dto/userDto";
import {AuthzService} from "./authz.service";
import {ValidationPipe} from "../pipes/validation.pipe";

@ApiTags('Авторизация')
@Controller('auth')
export class AuthzController {
    constructor(private authzService: AuthzService) {
    }

    @ApiOperation({summary: 'Авторизация пользователя'})
    @ApiResponse({status: 200})
    //@UsePipes(ValidationPipe)
    @Post('/login')
    login(@Body() userDto: UserDto) {
        return this.authzService.login(userDto)
    }

    @ApiOperation({summary: 'Регистрация пользователя'})
    @ApiResponse({status: 200})
    //@UsePipes(ValidationPipe)
    @Post('/register')
    register(@Body() userDto: UserDto) {
        return this.authzService.register(userDto)
    }
}
