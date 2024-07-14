import {Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards} from '@nestjs/common';
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {TasksProgressService} from "./tasks.progress.service";
import {TasksProgress} from "./tasks.progress.entity";
import {JwtAuthzGuard} from "../../authz/jwtAuthz.guard";
import {TasksProgressDto, UpdTasksProgressDto} from "../dto/tasks.progress.dto";

@ApiTags('Столбец прогресса')
@Controller('tasks_progress')
export class TasksProgressController {
    constructor(private tasksProgressService: TasksProgressService) {
    }

    @ApiOperation({summary: 'Создать столбец прогресса'})
    @ApiResponse({status: 200, type: TasksProgress})
    @Post('/create/:userId/:bpId')
    @UseGuards(JwtAuthzGuard)
    create(@Param('userId') userId: number,
           @Param('bpId') bpId: number,
           @Body() taskProgressDto: TasksProgressDto,
           @Req() req) {
        const user = req.user
        return this.tasksProgressService.createTasksProgress(userId, bpId, user, taskProgressDto)
    }

    @ApiOperation({summary: 'Показать все столбцы прогресса для проекта'})
    @ApiResponse({status: 200, type: [TasksProgress]})
    @Get(':userId/:bpId')
    @UseGuards(JwtAuthzGuard)
    getAll(@Param('userId') userid: number,
           @Param('bpId') bpId: number,
           @Req() req) {
        const user = req.user
        return this.tasksProgressService.getAllTasksProgressForBlueprint(userid, bpId, user)
    }
    @ApiOperation({summary: 'Обновить столбец прогресса'})
    @ApiResponse({status: 200, type: String})
    @Patch('/update/:userId/')
    @UseGuards(JwtAuthzGuard)
    update(@Param('userId') userId: number,
           @Query('id') taskProgressId: number,
           @Body() dataToUpdate: UpdTasksProgressDto,
           @Req() req) {
        const user = req.user
        return this.tasksProgressService.updateTasksProgress(userId, user, taskProgressId, dataToUpdate)
    }
    @ApiOperation({summary: 'Удалить столбец прогресса'})
    @ApiResponse({status: 200, type: String})
    @Delete(':userId')
    @UseGuards(JwtAuthzGuard)
    delete(@Param('userId') userId: number,
           @Query('id') taskProgressId: number,
           @Req() req) {
        const user = req.user
        return this.tasksProgressService.deleteTasksProgress(userId,user, taskProgressId)
    }

    @ApiOperation({summary: 'Поменять позицию столбцов прогресса'})
    @ApiResponse({status: 200, type: String})
    @Patch('/update/:userId/:tProgressId1')
    @UseGuards(JwtAuthzGuard)
    switchPos(@Param('userId') userId: number,
              @Param('tProgressId1') tProgressId1: number,
              @Query('id') tProgressId2: number,
              @Req() req) {
        const user = req.user
        return this.tasksProgressService.switchTasksProgressPositions(userId,tProgressId1, tProgressId2, user)
    }
}
