import {Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards} from '@nestjs/common';
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {TaskDto, UpdateTaskDto} from "./dto/taskDto";
import {TasksService} from "./tasks.service";
import {Task} from "./tasks.entity";
import {JwtAuthzGuard} from "../authz/jwtAuthz.guard";

@ApiTags('Задачи')
@Controller('tasks')
export class TasksController {
    constructor(private tasksService: TasksService) {
    }

    @ApiOperation({summary: 'Создать задачу'})
    @ApiResponse({status: 200, type: Task})
    @Post('/create/:userId/:bpId')
    @UseGuards(JwtAuthzGuard)
    create(@Param('userId') userId: number,
           @Param('bpId') bpId: number,
           @Body() taskDto: TaskDto,
           @Req() req) {
        const user = req.user
        return this.tasksService.create(userId, bpId, user, taskDto)
    }

    @ApiOperation({summary: 'Показать все задачи для проекта'})
    @ApiResponse({status: 200, type: [Task]})
    @Get(':userId/:bpId')
    @UseGuards(JwtAuthzGuard)
    getAllTasks(@Param('userId') userid: number,
                @Param('bpId') bpId: number,
                @Req() req) {
        const user = req.user
        return this.tasksService.getTasksForBlueprint(userid, user, bpId)
    }
    @ApiOperation({summary: 'Обновить задачу'})
    @ApiResponse({status: 200, type: [Task]})
    @Patch('/update/:userId/')
    @UseGuards(JwtAuthzGuard)
    updateTask(@Param('userId') userId: number,
                @Query('id') taskId: number,
                @Body() dataToUpdate: UpdateTaskDto,
                @Req() req) {
        const user = req.user
        return this.tasksService.updateTask(userId, user, taskId, dataToUpdate)
    }
    @ApiOperation({summary: 'Обновить задачу'})
    @ApiResponse({status: 200, type: [Task]})
    @Delete(':userId')
    @UseGuards(JwtAuthzGuard)
    deleteTask(@Param('userId') userId: number,
               @Query('id') taskId: number,
               @Req() req) {
        const user = req.user
        return this.tasksService.deleteTask(userId,user, taskId)
    }
}
