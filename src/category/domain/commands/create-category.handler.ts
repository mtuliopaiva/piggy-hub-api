import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateCategoryCommand } from './create-category.command';
import { CategoryService } from '../../service/category.service';
import { ReadCategoryDto } from '../dtos/read-category.dto';

@CommandHandler(CreateCategoryCommand)
export class CreateCategoryHandler implements ICommandHandler<CreateCategoryCommand> {
  constructor(private readonly categoryService: CategoryService) {}

  async execute(command: CreateCategoryCommand): Promise<ReadCategoryDto> {
    const category = await this.categoryService.createCategory(command.data);

    return {
      uuid: category.uuid,
      name: category.name,
      description: category.description ?? undefined,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
      deletedAt: category.deletedAt,
    };
  }
}
