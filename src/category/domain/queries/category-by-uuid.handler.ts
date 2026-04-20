import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CategoryByUuidQuery } from './category-by-uuid.query';
import { CategoryService } from '../../service/category.service';
import { ReadCategoryDto } from '../dtos/read-category.dto';

@QueryHandler(CategoryByUuidQuery)
export class CategoryByUuidHandler implements IQueryHandler<CategoryByUuidQuery> {
  constructor(private readonly service: CategoryService) {}

  async execute(query: CategoryByUuidQuery): Promise<ReadCategoryDto> {
    const category = await this.service.findByUuid(query.uuid);

    return {
      uuid: category.uuid,
      name: category.name,
      description: category.description ?? undefined,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
      deletedAt: category.deletedAt ?? null,
    };
  }
}
