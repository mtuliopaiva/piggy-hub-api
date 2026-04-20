import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Permissions } from '../../auth/decorators/permissions-user.decorator';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { Permission } from '../../auth/enums/permission.type';
import { ListCategoryQuery } from '../domain/queries/list-category.query';
import { CreateCategoryCommand } from '../domain/commands/create-category.command';
import { CreateCategoryDto } from '../domain/dtos/create-category.dto';
import { UpdateCategoryCommand } from '../domain/commands/update-category.command';
import { UpdateCategoryDto } from '../domain/dtos/update-category.dto';
import { CategoryByUuidQuery } from '../domain/queries/category-by-uuid.query';
import { DeleteCategoryCommand } from '../domain/commands/delete-category.command';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import type { AuthUser } from '../../auth/types/auth-user.type';
import { RestoreCategoryCommand } from '../domain/commands/restore-category.command';
@ApiTags('Category')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('categories')
export class CategoryController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  @ApiQuery({ name: 'search', required: false })
  list(@Query('search') search?: string) {
    return this.queryBus.execute(
      new ListCategoryQuery({
        search,
      }),
    );
  }

  @Get(':uuid')
  findByUuid(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
    return this.queryBus.execute(new CategoryByUuidQuery(uuid));
  }

  @Post()
  @Permissions(Permission.CATEGORY_CREATE)
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.commandBus.execute(
      new CreateCategoryCommand(createCategoryDto),
    );
  }

  @Patch(':uuid')
  @Permissions(Permission.CATEGORY_UPDATE)
  update(
    @Param('uuid', new ParseUUIDPipe()) uuid: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.commandBus.execute(
      new UpdateCategoryCommand(uuid, updateCategoryDto),
    );
  }

  @Delete(':uuid')
  @Permissions(Permission.CATEGORY_DELETE)
  delete(
    @Param('uuid', new ParseUUIDPipe()) uuid: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.commandBus.execute(new DeleteCategoryCommand(uuid, user));
  }

  @Post(':uuid/restore')
  @Permissions(Permission.CATEGORY_RESTORE)
  restore(
    @Param('uuid', new ParseUUIDPipe()) uuid: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.commandBus.execute(new RestoreCategoryCommand(uuid, user));
  }
}
