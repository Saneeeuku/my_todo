import {Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards} from '@nestjs/common';
import {BlueprintDto, UpdateBlueprintDto} from './dto/blueprint.dto'
import {ApiTags} from "@nestjs/swagger";
import {BlueprintsService} from "./blueprints.service";
import {JwtAuthzGuard} from "../authz/jwtAuthz.guard";

@ApiTags('Проекты пользователя')
@Controller('blueprints')
export class BlueprintsController {
    constructor(private blueprintsService: BlueprintsService) {
    }

    @Post('/create/:userId')
    @UseGuards(JwtAuthzGuard)
    createBlueprint(@Param('userId') userId: number,
                    @Body() dto: BlueprintDto,
                    @Req() req) {
        const user = req.user
        return this.blueprintsService.createBlueprint(userId, user, dto)
    }

    @Get(':userId')
    @UseGuards(JwtAuthzGuard)
    getAllBlueprints(@Param('userId') userId: number, @Req() req) {
        const user = req.user
        return this.blueprintsService.getAllBlueprints(userId, user)
    }

    @Patch('/update/:userId')
    @UseGuards(JwtAuthzGuard)
    updateBlueprint(@Param('userId') userId: number,
                    @Query('id') blueprintId: number,
                    @Body() dataToUpdate: UpdateBlueprintDto,
                    @Req() req) {
        const user = req.user
        return this.blueprintsService.updateBlueprint(userId, user, blueprintId, dataToUpdate)
    }

    @Delete('/:userId')
    @UseGuards(JwtAuthzGuard)
    deleteBlueprint(@Param('userId') userId: number,
                    @Query('id') blueprintId: number,
                    @Req() req) {
        const user = req.user
        return this.blueprintsService.deleteBlueprint(userId, user, blueprintId)
    }
}
