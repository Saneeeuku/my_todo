import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Task} from "./task.entity";
import {TaskDto, UpdateTaskDto} from "./dto/task.dto";
import {TokenUserDto} from "../users/dto/user.dto";
import {Blueprint} from "../blueprints/blueprints.entity";
import {TasksProgress} from "./tasks.progress/tasks.progress.entity";


@Injectable()
export class TaskService {
    constructor(@InjectRepository(Task) private taskRepository: Repository<Task>,
                @InjectRepository(TasksProgress) private taskProgressRepository: Repository<TasksProgress>,
                @InjectRepository(Blueprint) private blueprintRepository: Repository<Blueprint>) {
    }

    async create(reqUserId: number, reqBpId: number, reqTProgressId: number, user: TokenUserDto, taskDto: TaskDto) {
        await this.checkRights(reqUserId, user.id)
        const res = await this.taskRepository.createQueryBuilder('task')
            .leftJoin('task.tasksProgress', 'tProgress')
            .where('title = :title', {title: taskDto.title})
            .andWhere('task.userId = :userId', {userId: user.id})
            .andWhere('task.blueprintId = :bpId', {bpId: reqBpId})
            .andWhere('tProgress.id = :tpId', {tpId: reqTProgressId})
            .getOne()
        if (res) {
            throw new HttpException('Задача уже сущесвует', HttpStatus.BAD_REQUEST)
        }
        const blueprint = await this.blueprintRepository.findOne({
            where: {
                id: reqBpId
            }
        })
        const progress = await this.blueprintRepository.findOne({
            where: {
                id: reqTProgressId
            }
        })
        if (!blueprint || !progress) {
            throw new HttpException('Ошибка добавления задачи', HttpStatus.BAD_REQUEST)
        }
        const task = this.taskRepository.create({...taskDto, user, blueprint, progress})
        await this.taskRepository.save(task)
        return "Задача создана"
    }

    async getAllTasksForBlueprint(reqUserId: number, reqBpId: number, user: TokenUserDto) {
        await this.checkRights(reqUserId, user.id)
        const tasks = await this.taskRepository.find({
            where: {
                user: {
                    id: user.id
                },
                blueprint: {
                    id: reqBpId
                }
            },
            relations: {
                user: true,
                blueprint: true,
                progress: true
            }
        })
        if (tasks.length === 0) {
            throw new HttpException('Ошибка при получении', HttpStatus.BAD_REQUEST)
        }
        return tasks
    }

    async updateTask(reqId: number, taskId: number, user: TokenUserDto, newData: UpdateTaskDto) {
        await this.checkRights(reqId, user.id)
        const res = await this.taskRepository.createQueryBuilder('task')
            .leftJoin('task.user', 'user')
            .update()
            .set({title: newData.title, description: newData.description})
            .where('id = :taskId AND user.id = :userId', {taskId, userId: user.id})
            .execute()
        if (res.affected === 0) {
            throw new HttpException('Ошибка при обновлении', HttpStatus.BAD_REQUEST)
        }
        return "Задача обновлёна"
    }

    async deleteTask(reqId: number, user: TokenUserDto, taskId: number) {
        await this.checkRights(reqId, user.id)
        const res = await this.taskRepository.createQueryBuilder('task')
            .leftJoin('task.user', 'user')
            .delete()
            .where('id = :taskId AND user.id = :userId', {taskId, userId: user.id})
            .execute()
        if (res.affected === 0) {
            throw new HttpException('Ошибка при удалении', HttpStatus.BAD_REQUEST)
        }
        return "Задача удалёна"
    }
    private async checkRights(reqId, loggedId) {
        if (String(reqId) !== String(loggedId)) {
            throw new HttpException('Нет доступа', HttpStatus.UNAUTHORIZED)
        }
    }
}
