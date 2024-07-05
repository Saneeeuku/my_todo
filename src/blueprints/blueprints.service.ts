import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {BlueprintDto} from "./dto/blueprint.dto";
import {InjectRepository} from "@nestjs/typeorm";
import {Blueprint} from "./blueprints.entity";
import {Repository} from "typeorm";
import {User} from "../users/users.entity";

@Injectable()
export class BlueprintsService {

    constructor(@InjectRepository(Blueprint) private blueprintRepository: Repository<Blueprint>) {
    }

    async createBlueprint(user: User, dto: BlueprintDto) {
        const blueprint = this.blueprintRepository.create({...dto, user})
        await this.blueprintRepository.save(blueprint)
        return "Проект создан"
    }
    async getAllBlueprints(user: User) {
        const blueprints = await this.blueprintRepository.find({
            where: {
                user: {
                    id: user.id
                }
            },
            relations: {
                user: true
            }
        })
        if (blueprints.length === 0) {
            throw new HttpException('Ошибка при получении', HttpStatus.BAD_REQUEST)
        }
        return blueprints
    }

    async updateBlueprint(user: User, blueprintId, title: string, description: string) {
        const res = await this.blueprintRepository.createQueryBuilder('blueprint')
            .leftJoin('blueprint.user', 'user')
            .update()
            .set({title, description})
            .where('id = :blueprintId AND user.id = :userId', {blueprintId, userId: user.id})
            .execute()
        if (res.affected === 0) {
            throw new HttpException('Ошибка при обновлении', HttpStatus.BAD_REQUEST)
        }
        return "Проект обновлён"
    }

    async deleteBlueprint(user: User, blueprintId) {
        const res = await this.blueprintRepository.createQueryBuilder('blueprint')
            .leftJoin('blueprint.user', 'user')
            .softDelete()
            .where('id = :blueprintId AND user.id = :userId', {blueprintId, userId: user.id})
            .execute()
        if (res.affected === 0) {
            throw new HttpException('Ошибка при удалении', HttpStatus.BAD_REQUEST)
        }
        return "Проект удалён"
    }
}
