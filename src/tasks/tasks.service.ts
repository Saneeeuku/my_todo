import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Task} from "./tasks.entity";
import {TaskDto} from "./dto/taskDto";

@Injectable()
export class TasksService {
    constructor(@InjectRepository(Task) private taskRepository: Repository<Task>) {
    }

    async create(dto: TaskDto) {
        const task = await this.taskRepository.create(dto)
        await this.taskRepository.save(task)
        return task
    }

    async get(dto: TaskDto) {
        return await this.taskRepository.find()
    }
}
