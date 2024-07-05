import {HttpException, HttpStatus, Injectable, UnauthorizedException} from '@nestjs/common';
import {UserDto} from "../users/dto/userDto";
import {UsersService} from "../users/users.service";
import {JwtService} from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs'
import {User} from "../users/users.entity";

@Injectable()
export class AuthzService {
    constructor(private userService: UsersService, private jwtService: JwtService) {
    }

    async login(userDto: UserDto) {
        const tempUser = await this.validateUser(userDto)
        return this.generateToken(tempUser)
    }

    async register(userDto: UserDto) {
        const tempUser = await this.userService.getUserByEmail(userDto.email)
        if (tempUser) {
            throw new HttpException('Пользователь с таким email уже существует',
                HttpStatus.BAD_REQUEST)
        }
        try {
            const hashPassword = await bcrypt.hash(userDto.password, 5)
            const user = await this.userService.createUser({...userDto, password: hashPassword})
            return this.generateToken(user)
        } catch (e) {

        }
    }

    private async generateToken(user: User) {
        const payload = {id: user.id, email: user.email}
        return {token: this.jwtService.sign(payload)}
    }

    private async validateUser(userDto: UserDto) {
        const user = await this.userService.getUserByEmail(userDto.email)
        try {
            const isEqualPass = await bcrypt.compare(userDto.password, user.password)
            if (user && isEqualPass) {
                return this.userService.getUserByEmailPublic(userDto.email)
            }
        } catch (e) {
            throw new HttpException(`${e.message}. Проверьте корректность вводимых данных.`,
                HttpStatus.BAD_REQUEST)
        }
        throw new UnauthorizedException({message: 'Неверный email или пароль'})
    }
}
