import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CategoryRepository } from '../repositories/category.repository';

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
}
