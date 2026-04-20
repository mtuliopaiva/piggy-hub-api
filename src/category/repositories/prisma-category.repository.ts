import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma.service';
import { CategoryRepository } from './category.repository';
import { CategoryEntity } from '../domain/entities/category.entity';
import { CreateCategoryData } from '../domain/types/create-category-data.type';

@Injectable()
export class PrismaCategoryRepository implements CategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

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
}
