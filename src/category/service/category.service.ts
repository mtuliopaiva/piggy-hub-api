import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CategoryRepository } from '../repositories/category.repository';
import { CreateCategoryDto } from '../domain/dtos/create-category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async list(params?: { search?: string }) {
    const [data, total] = await Promise.all([
      this.categoryRepository.findMany(params?.search),
      this.categoryRepository.count(params?.search),
    ]);

    return { data, total };
  }

  async createCategory(data: CreateCategoryDto) {
    return this.categoryRepository.create(data);
  }
}
