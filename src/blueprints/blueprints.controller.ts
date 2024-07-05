import {Body, Controller, Delete, Get, Patch, Post, Query, Req, UseGuards} from '@nestjs/common';
import {BlueprintDto} from './dto/blueprint.dto'
import {ApiTags} from "@nestjs/swagger";
import {BlueprintsService} from "./blueprints.service";
import {JwtAuthzGuard} from "../authz/jwtAuthz.guard";
import {User} from "../users/users.entity";
import {UserDto} from "../users/dto/userDto";

@ApiTags('Проекты пользователя')
@Controller('blueprints')
export class BlueprintsController {
    constructor(private blueprintsService: BlueprintsService) {
    }

    @UseGuards(JwtAuthzGuard)
    @Post('/create')
    createBlueprint(@Body() dto: BlueprintDto, @Req() req){
        const user = req.user
        return this.blueprintsService.createBlueprint(user,dto)
    }
    @UseGuards(JwtAuthzGuard)
    @Get()
    getAllBlueprints(@Req() req){
        const user = req.user
        return this.blueprintsService.getAllBlueprints(user)
    }

    @UseGuards(JwtAuthzGuard)
    @Patch('/update')
    updateBlueprint(@Query('id') idBlueprint: number,
                    @Body() dataToUpdate: {title: string, description: string},
                    @Req() req){
        const user = req.user
        return this.blueprintsService.updateBlueprint(user, idBlueprint,
            dataToUpdate.title, dataToUpdate.description)
    }

    @UseGuards(JwtAuthzGuard)
    @Delete()
    deleteBlueprint(@Query('id') idBlueprint: number, @Req() req){
        const user = req.user
        return this.blueprintsService.deleteBlueprint(user, idBlueprint)
    }
}
