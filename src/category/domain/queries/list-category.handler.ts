import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListCategoryQuery } from './list-category.query';
import { ReadCategoryDto } from '../dtos/read-category.dto';
import { CategoryService } from '../../service/category.service';

@QueryHandler(ListCategoryQuery)
export class ListCategoryHandler implements IQueryHandler<ListCategoryQuery> {
  constructor(private readonly service: CategoryService) {}

  async execute(query: ListCategoryQuery): Promise<{
    data: ReadCategoryDto[];
    meta: { total: number };
  }> {
    const { data, total } = await this.service.list(query.data);

    return {
      data: data.map(
        (category): ReadCategoryDto => ({
          uuid: category.uuid,
          name: category.name,
          description: category.description ?? undefined,
          createdAt: category.createdAt,
          updatedAt: category.updatedAt,
          deletedAt: category.deletedAt,
        }),
      ),
      meta: { total },
    };
  }
}
