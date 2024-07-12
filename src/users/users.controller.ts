import {Body, Controller, Delete, Get, Param, Patch, Req, UseGuards} from '@nestjs/common';
import {UpdateUserDto} from './dto/user.dto'
import {UsersService} from "./users.service";
import {ApiTags, ApiOperation, ApiResponse} from "@nestjs/swagger"
import {User} from "./users.entity";
import {JwtAuthzGuard} from "../authz/jwtAuthz.guard";

@ApiTags('Пользователи')
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {
    }

    @ApiOperation({summary: 'Показать всех пользователей (dev only)'})
    @ApiResponse({status: 200, type: [User]})
    @Get()
    @UseGuards(JwtAuthzGuard)
    getAll(@Req() req) {
        return this.usersService.getAllUsers()
    }

    @ApiOperation({summary: 'Показать пользователя', description: 'Только для авторизированных пользователей'})
    @ApiResponse({status: 200, type: User})
    @Get(':userId')
    @UseGuards(JwtAuthzGuard)
    getOne(@Param('userId') reqId: number, @Req() req) {
        const user = req.user
        return this.usersService.getUser(reqId, user)
    }

    @ApiOperation({summary: 'Обновить данные пользователя', description: 'Только для авторизированных пользователей'})
    @ApiResponse({status: 200, type: String})
    @Patch(':userId')
    @UseGuards(JwtAuthzGuard)
    update(@Body() dataToUpdate: UpdateUserDto,
           @Param('userId') reqId: number,
           @Req() req) {
        const user = req.user
        return this.usersService.updateUser(reqId,user,
            dataToUpdate.email, dataToUpdate.password)
    }

    @ApiOperation({summary: 'Удалить пользователя', description: 'Только для авторизированных пользователей'})
    @ApiResponse({status: 200, type: String})
    @Delete(':userId')
    @UseGuards(JwtAuthzGuard)
    delete(@Param('userId') userId: number, @Req() req) {
        const user = req.user
        return this.usersService.deleteUser(userId, user)
    }
}
