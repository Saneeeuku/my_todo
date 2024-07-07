import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Task} from "./tasks.entity";
import {TaskDto, UpdateTaskDto} from "./dto/taskDto";
import {TokenUserDto} from "../users/dto/userDto";
import {Blueprint} from "../blueprints/blueprints.entity";

@Injectable()
export class TasksService {
    constructor(@InjectRepository(Task) private taskRepository: Repository<Task>,
                @InjectRepository(Blueprint) private blueprintRepository: Repository<Blueprint>) {
    }

    async create(reqUserId: number, reqBpId: number, user: TokenUserDto, dto: TaskDto) {
        await this.checkRights(reqUserId, user.id)
        const res = await this.taskRepository.createQueryBuilder('task')
            .where('title = :title', {title: dto.title})
            .andWhere('task.userId = :userId', {userId: user.id})
            .andWhere('task.blueprintId = :bpId', {bpId: reqBpId})
            .getOne()
        if (res) {
            throw new HttpException('Задача уже сущесвует', HttpStatus.BAD_REQUEST)
        }
        const blueprint = await this.blueprintRepository.findOne({
            where: {
                id: reqBpId
            }
        })
        if (!blueprint) {
            throw new HttpException('Ошибка добавления задачи', HttpStatus.BAD_REQUEST)
        }
        const task = this.taskRepository.create({...dto, user, blueprint})
        await this.taskRepository.save(task)
        return "Задача создана"
    }

    async getTasksForBlueprint(reqUserId: number, user: TokenUserDto, reqBpId: number) {
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
                blueprint: true
            }
        })
        if (tasks.length === 0) {
            throw new HttpException('Ошибка при получении', HttpStatus.BAD_REQUEST)
        }
        return tasks
    }

    async updateTask(reqId: number, user: TokenUserDto, taskId: number, newData: UpdateTaskDto) {
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
