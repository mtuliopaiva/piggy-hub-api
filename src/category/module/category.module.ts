import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CategoryRepository } from '../repositories/category.repository';
import { PrismaCategoryRepository } from '../repositories/prisma-category.repository';

import { AuditModule } from '../../audits/module/audit.module';
import { ListCategoryQuery } from '../domain/queries/list-category.query';
import { CategoryController } from '../controller/category.controller';
import { CategoryService } from '../service/category.service';
import { ListCategoryHandler } from '../domain/queries/list-category.handler';
import { CreateCategoryHandler } from '../domain/commands/create-category.handler';

const CommandHandlers = [ListCategoryHandler, CreateCategoryHandler];

const QueryHandlers = [ListCategoryQuery];

@Module({
  imports: [CqrsModule, AuditModule],
  controllers: [CategoryController],
  providers: [
    CategoryService,
    {
      provide: CategoryRepository,
      useClass: PrismaCategoryRepository,
    },
    ...CommandHandlers,
    ...QueryHandlers,
  ],
  exports: [CategoryRepository],
})
export class CategoryModule {}
