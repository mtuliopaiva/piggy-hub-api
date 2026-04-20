import { CategoryEntity } from '../domain/entities/category.entity';
import { CreateCategoryData } from '../domain/types/create-category-data.type';

export abstract class CategoryRepository {
  abstract findMany(search?: string): Promise<CategoryEntity[]>;
  abstract count(search?: string): Promise<number>;
  abstract create(data: CreateCategoryData): Promise<CategoryEntity>;
}
