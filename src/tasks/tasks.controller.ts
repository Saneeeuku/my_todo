import {Body, Controller, Get, Post} from '@nestjs/common';
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {TaskDto} from "./dto/taskDto";
import {TasksService} from "./tasks.service";
import {Task} from "./tasks.entity";

@ApiTags('Задачи')
@Controller('tasks')
export class TasksController {
    constructor(private tasksService: TasksService) {
    }

    @ApiOperation({summary: 'Создать задачу'})
    @ApiResponse({status: 200, type: Task})
    @Post('/')
    create(@Body() taskDto: TaskDto) {
        return this.tasksService.create(taskDto)
    }

    @ApiOperation({summary: 'Показать задачу'})
    @ApiResponse({status: 200, type: [Task]})
    @Get('/')
    get(@Body() taskDto: TaskDto) {
        return this.tasksService.get(taskDto)
    }
}
