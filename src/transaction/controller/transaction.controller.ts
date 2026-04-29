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
import { CreateTransactionCommand } from '../domain/commands/create-transaction.command';
import { CreateTransactionDto } from '../domain/dtos/create-transaction.dto';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import type { AuthUser } from '../../auth/types/auth-user.type';
import { TransactionByUuidQuery } from '../domain/queries/transaction-by-uuid.query';
import { ListTransactionQuery } from '../domain/queries/list-transaction.query';
import { UpdateTransactionDto } from '../domain/dtos/update-transaction.dto';
import { UpdateTransactionCommand } from '../domain/commands/update-transaction.command';
import { DeleteTransactionCommand } from '../domain/commands/delete-transaction.command';
import { RestoreTransactionCommand } from '../domain/commands/restore-transaction.command';
@ApiTags('Transaction')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('transaction')
export class TransactionController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  @Permissions(Permission.TRANSACTION_READ)
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'categoryUuid', required: false })
  list(
    @CurrentUser() user: AuthUser,
    @Query('search') search?: string,
    @Query('categoryUuid') categoryUuid?: string,
  ) {
    return this.queryBus.execute(
      new ListTransactionQuery({
        search,
        categoryUuid,
        user,
      }),
    );
  }

  @Get('category/:categoryUuid')
  findByCategoryUuid(
    @Param('categoryUuid', new ParseUUIDPipe()) categoryUuid: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.queryBus.execute(
      new ListTransactionQuery({ categoryUuid, user }),
    );
  }

  @Get(':uuid')
  findByUuid(
    @Param('uuid', new ParseUUIDPipe()) uuid: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.queryBus.execute(new TransactionByUuidQuery(uuid, user));
  }

  @Post()
  @Permissions(Permission.TRANSACTION_CREATE)
  create(@Body() dto: CreateTransactionDto, @CurrentUser() user: AuthUser) {
    return this.commandBus.execute(new CreateTransactionCommand(dto, user));
  }

  @Patch(':uuid')
  @Permissions(Permission.TRANSACTION_UPDATE)
  update(
    @Param('uuid', new ParseUUIDPipe()) uuid: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.commandBus.execute(
      new UpdateTransactionCommand(uuid, updateTransactionDto, user),
    );
  }

  @Delete(':uuid')
  @Permissions(Permission.TRANSACTION_DELETE)
  delete(
    @Param('uuid', new ParseUUIDPipe()) uuid: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.commandBus.execute(new DeleteTransactionCommand(uuid, user));
  }

  @Post(':uuid/restore')
  @Permissions(Permission.TRANSACTION_RESTORE)
  restore(
    @Param('uuid', new ParseUUIDPipe()) uuid: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.commandBus.execute(new RestoreTransactionCommand(uuid, user));
  }
}
