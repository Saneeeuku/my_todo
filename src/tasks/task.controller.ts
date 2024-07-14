import {Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards} from '@nestjs/common';
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {TaskDto, UpdateTaskDto} from "./dto/task.dto";
import {TaskService} from "./task.service";
import {Task} from "./task.entity";
import {JwtAuthzGuard} from "../authz/jwtAuthz.guard";

@ApiTags('Задачи')
@Controller('task')
export class TaskController {
    constructor(private taskService: TaskService) {
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
        return this.taskService.create(userId,bpId,tpId,
            user,taskDto)
    }

    @ApiOperation({summary: 'Показать все задачи для проекта'})
    @ApiResponse({status: 200, type: [Task]})
    @Get(':userId/:bpId/')
    @UseGuards(JwtAuthzGuard)
    getAll(@Param('userId') userid: number,
           @Param('bpId') bpId: number,
           @Req() req) {
        const user = req.user
        return this.taskService.getAllTasksForBlueprint(userid, bpId, user)
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
        return this.taskService.updateTask(userId,taskId, user, dataToUpdate)
    }
    @ApiOperation({summary: 'Удалить задачу'})
    @ApiResponse({status: 200, type: String})
    @Delete(':userId')
    @UseGuards(JwtAuthzGuard)
    delete(@Param('userId') userId: number,
           @Query('id') taskId: number,
           @Req() req) {
        const user = req.user
        return this.taskService.deleteTask(userId,user, taskId)
    }
    @ApiOperation({summary: 'Поменять позицию задач'})
    @ApiResponse({status: 200, type: String})
    @Patch('/update/:userId/:taskId1')
    @UseGuards(JwtAuthzGuard)
    switchPos(@Param('userId') userId: number,
              @Param('taskId1') taskId1: number,
              @Query('id') taskId2: number,
              @Req() req) {
        const user = req.user
        return this.taskService.switchTasksPositions(userId,taskId1, taskId2, user)
    }
}
