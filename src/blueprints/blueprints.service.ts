import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {BlueprintDto, UpdateBlueprintDto} from "./dto/blueprint.dto";
import {InjectRepository} from "@nestjs/typeorm";
import {Blueprint} from "./blueprints.entity";
import {Repository} from "typeorm";
import {TokenUserDto} from "../users/dto/user.dto";

@Injectable()
export class BlueprintsService {

    constructor(@InjectRepository(Blueprint) private blueprintRepository: Repository<Blueprint>) {
    }

    async createBlueprint(reqUserId: number, user: TokenUserDto, dto: BlueprintDto) {
        await this.checkRights(reqUserId, user.id)
        const res = await this.blueprintRepository.createQueryBuilder('blueprint')
            .where('title = :title AND blueprint.userId = :userId', {title: dto.title, userId: user.id})
            .getOne()
        if (res) {
            throw new HttpException('Проект с таким названием уже сущесвует', HttpStatus.BAD_REQUEST)
        }
        const blueprint = this.blueprintRepository.create({...dto, user})
        await this.blueprintRepository.save(blueprint)
        return "Проект создан"
    }

    async getAllBlueprints(reqId: number, user: TokenUserDto) {
        await this.checkRights(reqId, user.id)
        const blueprints= await this.blueprintRepository.find({
            where: {
                user: {
                    id: user.id
                }
            },
            relations: {
                user: true,
                tasksProgress: {
                    tasks: true
                }
            }
        })
        if (blueprints.length === 0) {
            throw new HttpException('Ошибка при получении', HttpStatus.BAD_REQUEST)
        }
        return blueprints
    }

    async updateBlueprint(reqId: number, user: TokenUserDto, blueprintId: number, newData: UpdateBlueprintDto) {
        await this.checkRights(reqId, user.id)
        const res = await this.blueprintRepository.createQueryBuilder('blueprint')
            .leftJoin('blueprint.user', 'user')
            .update()
            .set({title: newData.title, description: newData.description})
            .where('id = :blueprintId AND user.id = :userId', {blueprintId, userId: user.id})
            .execute()
        if (res.affected === 0) {
            throw new HttpException('Ошибка при обновлении', HttpStatus.BAD_REQUEST)
        }
        return "Проект обновлён"
    }

    async deleteBlueprint(reqId: number, user: TokenUserDto, blueprintId: number) {
        await this.checkRights(reqId, user.id)
        const res = await this.blueprintRepository.createQueryBuilder('blueprint')
            .leftJoin('blueprint.user', 'user')
            .delete()
            .where('id = :blueprintId AND user.id = :userId', {blueprintId, userId: user.id})
            .execute()
        if (res.affected === 0) {
            throw new HttpException('Ошибка при удалении', HttpStatus.BAD_REQUEST)
        }
        return "Проект удалён"
    }

    private async checkRights(reqId, loggedId) {
        if (String(reqId) !== String(loggedId)) {
            throw new HttpException('Нет доступа', HttpStatus.UNAUTHORIZED)
        }
    }
}
