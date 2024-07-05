import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {User} from "./users.entity";
import {CreateUserDto, TokenUserDto} from "./dto/userDto";
import * as bcrypt from 'bcryptjs'

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private userRepository: Repository<User>) {
    }

    async createUser(dto: CreateUserDto) {
        const user = this.userRepository.create(dto)
        await this.userRepository.save(user)
        return user
    }

    async getAllUsers() {
        return await this.userRepository.find({
            select: {
                id: true,
                email: true,
                password: true
            },
            relations: {
                blueprints: true
            }
        })
    }

    async getUser(reqId: number, logUser: TokenUserDto) {
        if(Number(reqId) !== logUser.id){
            throw new HttpException('Ошибка при получении', HttpStatus.BAD_REQUEST)
        }
        const res = await this.userRepository.createQueryBuilder('user')
            .leftJoinAndSelect("user.blueprints", "blueprints")
            .addSelect('user.password')
            .where('user.email = :email',{email: logUser.email})
            .getOne();
        return res
    }
    async getUserByEmailPublic(email: string) {
        const user = await this.userRepository.findOne({
            where: {email},
            relations: {blueprints: true}
        })
        return user
    }
    async getUserForAutz(email: string) {
        return await this.userRepository.createQueryBuilder('user')
            .leftJoinAndSelect("user.blueprints", "blueprints")
            .addSelect('user.password')
            .where('user.email = :email', {email})
            .getOne();
    }

    async updateUser(reqId: number, user: TokenUserDto, email: string, password: string) {
        if(Number(reqId) !== user.id){
            throw new HttpException('Ошибка при обновлении', HttpStatus.BAD_REQUEST)
        }
        const hashPassword = await bcrypt.hash(password, 5)
        const res = await this.userRepository.createQueryBuilder('user')
            .update()
            .set({email, password: hashPassword})
            .where('id = :userId', {userId: user.id})
            .execute()
        if (res.affected === 0) {
            throw new HttpException('Ошибка при обновлении', HttpStatus.BAD_REQUEST)
        }
        return "Инфорация пользователя обновлёна"
    }

    async deleteUser(reqId: number, logUser: TokenUserDto) {
        if(Number(reqId) !== logUser.id){
            throw new HttpException('Ошибка при удалении', HttpStatus.BAD_REQUEST)
        }
        const res = await this.userRepository.createQueryBuilder('user')
            .restore()
            .where('id = :userId', {userId: logUser.id})
            .execute()
        if (res.affected === 0) {
            throw new HttpException('Ошибка при удалении', HttpStatus.BAD_REQUEST)
        }
        return "Пользователь удалён"
    }
}
