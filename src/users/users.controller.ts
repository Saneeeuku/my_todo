import {Body, Controller, Delete, Get, Post, UseGuards} from '@nestjs/common';
import {UserDto} from './dto/userDto'
import {UsersService} from "./users.service";
import {ApiTags, ApiOperation, ApiResponse} from "@nestjs/swagger"
import {User} from "./users.entity";
import {JwtAuthzGuard} from "../authz/jwtAuthz.guard";

@ApiTags('Пользователи')
@Controller()
export class UsersController {
    constructor(private usersService: UsersService) {
    }

    @ApiOperation({summary: 'Регистрация пользователя'})
    @ApiResponse({status: 200, type: User})
    @UseGuards(JwtAuthzGuard)
    @Post('/users')
    createUser(@Body() userDto: UserDto) {
        return this.usersService.createUser(userDto)
    }

    @ApiOperation({summary: 'Показать всех пользователей (dev only)'})
    @ApiResponse({status: 200, type: [User]})
    @UseGuards(JwtAuthzGuard)
    @Get('/users')
    getAllUser() {
        return this.usersService.getAllUsers()
    }

    @ApiOperation({summary: 'Показать пользователя по почте, с паролем'})
    @UseGuards(JwtAuthzGuard)
    @Get('/user')
    getUser(@Body() userDto: UserDto) {
        return this.usersService.getUserByEmail(userDto.email)
    }

    // @ApiOperation({summary: 'Показать пользователя по почте, без пароля (dev only)'})
    // @UseGuards(JwtAuthzGuard)
    // @Get('/userp')
    // getUserPublic(@Body() userDto: UserDto) {
    //     return this.usersService.getUserByEmailPublic(userDto.email)
    // }

    @ApiOperation({summary: 'Удалить пользователя по почте и паролю'})
    @ApiResponse({status: 200, type: [User]})
    @UseGuards(JwtAuthzGuard)
    @Delete('/users')
    deleteUser(@Body() userDto: UserDto) {
        return this.usersService.deleteUser(userDto)
    }
}
