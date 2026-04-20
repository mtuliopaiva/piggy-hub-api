import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CategoryRepository } from '../repositories/category.repository';
import { CreateCategoryDto } from '../domain/dtos/create-category.dto';
import { UpdateCategoryDto } from '../domain/dtos/update-category.dto';
import { toAuditJson } from '../../audits/utils/convertToAuditJson';
import { AuditService } from '../../audits/service/audit.service';

@Injectable()
export class CategoryService {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly auditService: AuditService,
  ) {}

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

  async updateCategory(uuid: string, dto: UpdateCategoryDto) {
    const category = await this.categoryRepository.findByUuid(uuid);

    if (!category || category.deletedAt) {
      throw new NotFoundException('Category not found');
    }

    return this.categoryRepository.updateCategory(uuid, dto);
  }

  async findByUuid(uuid: string) {
    const category = await this.categoryRepository.findByUuid(uuid);

    if (!category || category.deletedAt) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async softDelete(uuid: string, actor: { uuid: string; email: string }) {
    const oldCategory = await this.categoryRepository.findByUuid(uuid);

    if (!oldCategory || oldCategory.deletedAt) {
      throw new NotFoundException('Category not found');
    }

    const deletedCategory = await this.categoryRepository.softDelete(uuid);

    await this.auditService.create({
      actorUuid: actor.uuid,
      actorEmail: actor.email,
      action: 'category.delete',
      entity: 'Category',
      entityUuid: uuid,
      oldData: toAuditJson(oldCategory),
      newData: toAuditJson(deletedCategory),
    });

    return deletedCategory;
  }

  async restore(uuid: string, actor: { uuid: string; email: string }) {
    const category = await this.categoryRepository.findByUuid(uuid);

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (!category.deletedAt) {
      throw new BadRequestException('Category is not deleted');
    }

    const restoredCategory = await this.categoryRepository.restore(uuid);

    await this.auditService.create({
      actorUuid: actor.uuid,
      actorEmail: actor.email,
      action: 'category.restore',
      entity: 'Category',
      entityUuid: uuid,
      oldData: toAuditJson(category),
      newData: toAuditJson(restoredCategory),
    });

    return restoredCategory;
  }
}
