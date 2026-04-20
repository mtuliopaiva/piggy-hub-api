import { UpdateCategoryDto } from '../domain/dtos/update-category.dto';
import { CategoryEntity } from '../domain/entities/category.entity';
import { CreateCategoryData } from '../domain/types/create-category-data.type';

export abstract class CategoryRepository {
  abstract findMany(search?: string): Promise<CategoryEntity[]>;
  abstract findByUuid(uuid: string): Promise<CategoryEntity | null>;
  abstract count(search?: string): Promise<number>;
  abstract create(data: CreateCategoryData): Promise<CategoryEntity>;
  abstract updateCategory(
    uuid: string,
    dto: UpdateCategoryDto,
  ): Promise<CategoryEntity>;
  abstract softDelete(uuid: string): Promise<CategoryEntity>;
  abstract restore(uuid: string): Promise<CategoryEntity>;
}
