import {Body, Controller, Delete, Get, Param, Patch, Req, UseGuards} from '@nestjs/common';
import {UpdateUserDto} from './dto/userDto'
import {UsersService} from "./users.service";
import {ApiTags, ApiOperation, ApiResponse} from "@nestjs/swagger"
import {User} from "./users.entity";
import {JwtAuthzGuard} from "../authz/jwtAuthz.guard";

@ApiTags('Пользователи')
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {
    }

    // @ApiOperation({summary: 'Регистрация пользователя'})
    // @ApiResponse({status: 200, type: User})
    // @UseGuards(JwtAuthzGuard)
    // @Post('/users')
    // createUser(@Body() userDto: UserDto) {
    //     return this.usersService.createUser(userDto)
    // }

    @ApiOperation({summary: 'Показать всех пользователей (dev only)'})
    @ApiResponse({status: 200, type: [User]})
    @UseGuards(JwtAuthzGuard)
    @Get()
    getAllUser(@Req() req) {
        return this.usersService.getAllUsers()
    }

    @ApiOperation({summary: 'Показать пользователя по почте, с паролем'})
    @UseGuards(JwtAuthzGuard)
    @Get(':userId')
    getUser(@Param('userId') reqId: number, @Req() req) {
        const user = req.user
        return this.usersService.getUser(reqId, user)
    }

    @ApiOperation({summary: 'Обновить данные пользователя'})
    @UseGuards(JwtAuthzGuard)
    @Patch(':userId')
    updateUser(@Body() dataToUpdate: UpdateUserDto,
               @Param('userId') reqId: number,
               @Req() req) {
        const user = req.user
        return this.usersService.updateUser(reqId,user, dataToUpdate.email, dataToUpdate.password)
    }

    @ApiOperation({summary: 'Удалить пользователя по почте и паролю'})
    @ApiResponse({status: 200, type: [User]})
    @UseGuards(JwtAuthzGuard)
    @Delete(':userId')
    deleteUser(@Param('userId') userId: number,
               @Req() req) {
        const user = req.user
        return this.usersService.deleteUser(userId, user)
    }
}
