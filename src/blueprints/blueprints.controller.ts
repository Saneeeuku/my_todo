import {Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards} from '@nestjs/common';
import {BlueprintDto} from './dto/blueprint.dto'
import {ApiTags} from "@nestjs/swagger";
import {BlueprintsService} from "./blueprints.service";
import {JwtAuthzGuard} from "../authz/jwtAuthz.guard";

@ApiTags('Проекты пользователя')
@Controller('blueprints')
export class BlueprintsController {
    constructor(private blueprintsService: BlueprintsService) {
    }

    @UseGuards(JwtAuthzGuard)
    @Post('/create/:userId')
    createBlueprint(@Param('userId') userId: number, @Body() dto: BlueprintDto, @Req() req){
        const user = req.user
        return this.blueprintsService.createBlueprint(userId,user,dto)
    }
    @UseGuards(JwtAuthzGuard)
    @Get(':id')
    getAllBlueprints(@Param('id') id: number, @Req() req){
        const user = req.user
        return this.blueprintsService.getAllBlueprints(id,user)
    }

    @UseGuards(JwtAuthzGuard)
    @Patch('/update/:userId')
    updateBlueprint(@Param('userId') userId: number,
                    @Query('id') blueprintId: number,
                    @Body() dataToUpdate: {title: string, description: string},
                    @Req() req){
        const user = req.user
        return this.blueprintsService.updateBlueprint(userId, user, blueprintId,
            dataToUpdate.title, dataToUpdate.description)
    }

    @UseGuards(JwtAuthzGuard)
    @Delete('/:userId')
    deleteBlueprint(@Param('userId') userId: number, @Query('id') idBlueprint: number, @Req() req){
        const user = req.user
        return this.blueprintsService.deleteBlueprint(userId, user, idBlueprint)
    }
}
