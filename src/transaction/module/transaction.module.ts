import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TransactionRepository } from '../repositories/transaction.repository';
import { PrismaTransactionRepository } from '../repositories/prisma-transaction.repository';

import { AuditModule } from '../../audits/module/audit.module';
import { TransactionController } from '../controller/transaction.controller';

import { CreateTransactionHandler } from '../domain/commands/create-transaction.handler';
import { TransactionService } from '../service/transaction.service';
import { PrismaCategoryRepository } from '../../category/repositories/prisma-category.repository';
import { CategoryRepository } from '../../category/repositories/category.repository';
import { TransactionByUuidHandler } from '../domain/queries/transaction-by-uuid.handler';
import { ListTransactionHandler } from '../domain/queries/list-category.handler';

const CommandHandlers = [CreateTransactionHandler];

const QueryHandlers = [TransactionByUuidHandler, ListTransactionHandler];

@Module({
  imports: [CqrsModule, AuditModule],
  controllers: [TransactionController],
  providers: [
    TransactionService,
    {
      provide: TransactionRepository,
      useClass: PrismaTransactionRepository,
    },
    {
      provide: CategoryRepository,
      useClass: PrismaCategoryRepository,
    },
    ...CommandHandlers,
    ...QueryHandlers,
  ],
  exports: [TransactionRepository],
})
export class TransactionModule {}
