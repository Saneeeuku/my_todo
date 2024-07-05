import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {User} from "./users.entity";
import {UserDto} from "./dto/userDto";

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private userRepository: Repository<User>) {
    }

    async createUser(dto: UserDto) {
        const user = this.userRepository.create(dto)
        await this.userRepository.save(user)
        return user
    }

    async getAllUsers() {
        return await this.userRepository.find({
            relations: {
                blueprints: true
            }
        })
    }

    async getUser(dto: UserDto) {
        const user = await this.userRepository.findOne({
            where: {
                email: dto.email,
                password: dto.password
            },
            relations: {
                blueprints: true
            }
        })
        return user
    }

    async getUserByEmail(email: string) {
        const user = await this.userRepository.createQueryBuilder('user')
            .leftJoinAndSelect("user.blueprints", "blueprints")
            .addSelect('user.password')
            .where('user.email = :email', {email})
            .getOne();
        return user
    }
    async getUserByEmailPublic(email: string) {
        const user = await this.userRepository.findOne({
            where: {email},
            relations: {blueprints: true}
        })
        return user
    }

    async updateUser(dto: UserDto) {
        const user = this.getUser(dto)
        if (typeof user !== "string") {
            return await this.userRepository.save(dto)
        }
    }

    async deleteUser(dto: UserDto) {
        const result = await this.userRepository.delete(dto)
        if (result.affected === 0) {
            throw new HttpException('Пользователь не найден', HttpStatus.BAD_REQUEST)
        }
        return result
    }
}
