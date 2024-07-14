import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {TokenUserDto} from "../../users/dto/user.dto";
import {Blueprint} from "../../blueprints/blueprints.entity";
import {TasksProgressDto, UpdTasksProgressDto} from "../dto/tasks.progress.dto";
import {TasksProgress} from "./tasks.progress.entity";


@Injectable()
export class TasksProgressService {
    constructor(@InjectRepository(TasksProgress) private tasksProgressRepository: Repository<TasksProgress>,
                @InjectRepository(Blueprint) private blueprintRepository: Repository<Blueprint>) {
    }

    async createTasksProgress(reqUserId: number, reqBpId: number, user: TokenUserDto, taskProgressDto: TasksProgressDto) {
        await this.checkRights(reqUserId, user.id)
        const temp = await this.tasksProgressRepository.createQueryBuilder('taskProgress')
            .where('title = :title', {title: taskProgressDto.title})
            .andWhere('taskProgress.userId = :userId', {userId: user.id})
            .andWhere('taskProgress.blueprintId = :bpId', {bpId: reqBpId})
            .orWhere('taskProgress.position = :pos', {pos: taskProgressDto.position})
            .getOne()
        if (temp && (temp.title === taskProgressDto.title || temp.position === taskProgressDto.position)) {
            throw new HttpException('Столбец прогресса с таким названием или позицией уже сущесвует', HttpStatus.BAD_REQUEST)
        }
        const blueprint = await this.blueprintRepository.findOne({
            where: {
                id: reqBpId
            }
        })
        if (!blueprint) {
            throw new HttpException('Ошибка добавления столбца прогресса', HttpStatus.BAD_REQUEST)
        }
        const taskProgress = this.tasksProgressRepository.create({...taskProgressDto, user, blueprint})
        await this.tasksProgressRepository.save(taskProgress)
        return "Столбец прогресса создан"
    }

    async getAllTasksProgressForBlueprint(reqUserId: number, reqBpId: number, user: TokenUserDto) {
        await this.checkRights(reqUserId, user.id)
        const res = await this.tasksProgressRepository.find({
            where: {
                user: {
                    id: user.id
                },
                blueprint: {
                    id: reqBpId
                }
            },
            relations: {
                // user: true,
                //blueprint: true,
                tasks: true
            },
            select: {
                id: true,
                title: true,
                position: true,
                tasks: true,
            },
            order: {
                position: "ASC",
                tasks: {
                    position: "ASC"
                }
            }
        })
        if (res.length === 0) {
            throw new HttpException('Ошибка при получении', HttpStatus.BAD_REQUEST)
        }
        return res
    }

    async updateTasksProgress(reqId: number, user: TokenUserDto, tasksProgressId: number, newData: UpdTasksProgressDto) {
        await this.checkRights(reqId, user.id)
        const temp = await this.tasksProgressRepository.createQueryBuilder('taskProgress')
            .where('taskProgress.userId = :userId', {userId: user.id})
            .andWhere('taskProgress.position = :posId', {posId: newData.position})
            .orWhere('taskProgress.title = :title', {title: newData.title})
            .getOne()
        if (temp) {
            throw new HttpException('Столбец прогресса с таким названием или позицией уже сущесвует', HttpStatus.BAD_REQUEST)
        }
        const res = await this.tasksProgressRepository.createQueryBuilder('tasksProgress')
            .leftJoin('tasksProgress.user', 'user')
            .update()
            .set({title: newData.title, position: newData.position})
            .where('id = :tpId AND user.id = :userId', {tpId: tasksProgressId, userId: user.id})
            .execute()
        if (res.affected === 0) {
            throw new HttpException('Ошибка при обновлении', HttpStatus.BAD_REQUEST)
        }
        return "Столбец прогресса обновлён"
    }

    async deleteTasksProgress(reqId: number, user: TokenUserDto, tasksProgressId: number) {
        await this.checkRights(reqId, user.id)
        const res = await this.tasksProgressRepository.createQueryBuilder('tasksProgress')
            .leftJoin('tasksProgress.user', 'user')
            .delete()
            .where('id = :tpId AND user.id = :userId', {tpId: tasksProgressId, userId: user.id})
            .execute()
        if (res.affected === 0) {
            throw new HttpException('Ошибка при удалении', HttpStatus.BAD_REQUEST)
        }
        return "Столбец прогресса удалён"
    }

    async switchTasksProgressPositions(reqId: number, tProgressId1: number, tProgressId2: number, user: TokenUserDto) {
        await this.checkRights(reqId, user.id)
        const [tProgress1, tProgress2] = await Promise.all([
            this.getTaskProgressById(tProgressId1),
            this.getTaskProgressById(tProgressId2),
        ])
        if ([tProgress1, tProgress2].includes(null)){
            throw new HttpException('Ошибка при смене позиции', HttpStatus.BAD_REQUEST)
        }
        const position1 = tProgress1.position
        await this.tasksProgressRepository.createQueryBuilder('tProgress1')
            .update()
            .set({ position: tProgress2.position})
            .where("id = :id", { id: tProgressId1 })
            .execute();
        await this.tasksProgressRepository.createQueryBuilder('tProgress2')
            .update()
            .set({ position: position1})
            .where("id = :id", { id: tProgressId2 })
            .execute();
        return "Позиция задач обновлена"
    }

    private async checkRights(reqId, loggedId) {
        if (String(reqId) !== String(loggedId)) {
            throw new HttpException('Нет доступа', HttpStatus.UNAUTHORIZED)
        }
    }
    private async getTaskProgressById(id: number){
        return await this.tasksProgressRepository.findOne({where: {id}})
    }
}
