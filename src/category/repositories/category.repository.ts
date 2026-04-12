import { CategoryEntity } from '../domain/entities/category.entity';

export abstract class CategoryRepository {
  abstract findMany(search?: string): Promise<CategoryEntity[]>;
  abstract count(search?: string): Promise<number>;
}
