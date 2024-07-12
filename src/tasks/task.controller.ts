import {Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards} from '@nestjs/common';
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {TaskDto, UpdateTaskDto} from "./dto/task.dto";
import {TaskService} from "./task.service";
import {Task} from "./task.entity";
import {JwtAuthzGuard} from "../authz/jwtAuthz.guard";

@ApiTags('Задачи')
@Controller('tasks')
export class TaskController {
    constructor(private tasksService: TaskService) {
    }

    @ApiOperation({summary: 'Создать задачу'})
    @ApiResponse({status: 200, type: Task})
    @Post('/create/:userId/:bpId/:tProgressId')
    @UseGuards(JwtAuthzGuard)
    create(@Param('userId') userId: number,
           @Param('bpId') bpId: number,
           @Param('tProgressId') tpId: number,
           @Body() taskDto: TaskDto,
           @Req() req) {
        const user = req.user
        return this.tasksService.create(userId,bpId,tpId,
            user,taskDto)
    }

    @ApiOperation({summary: 'Показать все задачи для проекта'})
    @ApiResponse({status: 200, type: [Task]})
    @Get(':userId/:bpId/:tProgressId')
    @UseGuards(JwtAuthzGuard)
    getAll(@Param('userId') userid: number,
           @Param('bpId') bpId: number,
           @Req() req) {
        const user = req.user
        return this.tasksService.getAllTasksForBlueprint(userid, bpId, user)
    }
    @ApiOperation({summary: 'Обновить задачу'})
    @ApiResponse({status: 200, type: String})
    @Patch('/update/:userId/')
    @UseGuards(JwtAuthzGuard)
    update(@Param('userId') userId: number,
           @Query('id') taskId: number,
           @Body() dataToUpdate: UpdateTaskDto,
           @Req() req) {
        const user = req.user
        return this.tasksService.updateTask(userId,taskId, user, dataToUpdate)
    }
    @ApiOperation({summary: 'Удалить задачу'})
    @ApiResponse({status: 200, type: String})
    @Delete(':userId')
    @UseGuards(JwtAuthzGuard)
    delete(@Param('userId') userId: number,
           @Query('id') taskId: number,
           @Req() req) {
        const user = req.user
        return this.tasksService.deleteTask(userId,user, taskId)
    }
}
