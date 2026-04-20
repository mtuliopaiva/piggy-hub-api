import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma.service';
import { CategoryRepository } from './category.repository';
import { CategoryEntity } from '../domain/entities/category.entity';
import { CreateCategoryData } from '../domain/types/create-category-data.type';
import { UpdateCategoryDto } from '../domain/dtos/update-category.dto';

@Injectable()
export class PrismaCategoryRepository implements CategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByUuid(uuid: string): Promise<CategoryEntity | null> {
    return this.prisma.category.findUnique({
      where: { uuid },
    });
  }

  async findMany(search?: string): Promise<CategoryEntity[]> {
    return this.prisma.category.findMany({
      where: {
        deletedAt: null,
        ...(search
          ? {
              name: {
                contains: search,
                mode: 'insensitive',
              },
              description: {
                contains: search,
                mode: 'insensitive',
              },
            }
          : {}),
      },
      select: {
        name: true,
        description: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    }) as Promise<CategoryEntity[]>;
  }

  async count(search?: string): Promise<number> {
    return this.prisma.category.count({
      where: {
        deletedAt: null,
        ...(search
          ? {
              name: {
                contains: search,
                mode: 'insensitive',
              },
              description: {
                contains: search,
                mode: 'insensitive',
              },
            }
          : {}),
      },
    });
  }

  async create(data: CreateCategoryData): Promise<CategoryEntity> {
    return this.prisma.category.create({
      data: {
        name: data.name,
        description: data.description,
      },
    });
  }

  async updateCategory(
    uuid: string,
    dto: UpdateCategoryDto,
  ): Promise<CategoryEntity> {
    return this.prisma.category.update({
      where: { uuid },
      data: {
        name: dto.name,
        description: dto.description,
      },
    });
  }

  async softDelete(uuid: string): Promise<CategoryEntity> {
    return this.prisma.category.update({
      where: { uuid },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async restore(uuid: string): Promise<CategoryEntity> {
    return this.prisma.category.update({
      where: { uuid },
      data: {
        deletedAt: null,
      },
    });
  }
}
