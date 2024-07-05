import {ArgumentMetadata, HttpException, HttpStatus, Injectable, PipeTransform} from "@nestjs/common";
import {plainToInstance} from 'class-transformer'
import {validate} from 'class-validator'
import {ValidateException} from "../exceptions/validate.exception";

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
    async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
        const obj = plainToInstance(metadata.metatype, value)
        let err
        try {
            err = await validate(obj)
        } catch (e) {
            console.log(value, '====\n', metadata.metatype, '====\n', obj.values)
            console.log(`${e.message}`)
            throw new ValidateException(`${e.message}`)
        }
        if (err.length !== 0) {
            let message = err.map(e => {
                return `${e.property} - ${Object.values(e.constraints).join(', ')}`
            })
            throw new ValidateException(message)
        }
        return value
    }
}