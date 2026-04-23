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
  @ApiQuery({ name: 'search', required: false })
  list(@Query('search') search?: string) {
    return this.queryBus.execute(
      new ListTransactionQuery({
        search,
      }),
    );
  }

  @Get('category/:categoryUuid')
  findByCategoryUuid(
    @Param('categoryUuid', new ParseUUIDPipe()) categoryUuid: string,
  ) {
    return this.queryBus.execute(new ListTransactionQuery({ categoryUuid }));
  }

  @Get(':uuid')
  findByUuid(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
    return this.queryBus.execute(new TransactionByUuidQuery(uuid));
  }

  @Post()
  @Permissions(Permission.TRANSACTION_CREATE)
  create(@Body() dto: CreateTransactionDto, @CurrentUser() user: AuthUser) {
    return this.commandBus.execute(new CreateTransactionCommand(dto, user));
  }
}
