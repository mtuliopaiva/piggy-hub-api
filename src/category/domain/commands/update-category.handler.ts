import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateCategoryCommand } from './update-category.command';
import { UpdateCategoryDto } from '../dtos/update-category.dto';
import { CategoryService } from '../../service/category.service';
import { ReadCategoryDto } from '../dtos/read-category.dto';

@CommandHandler(UpdateCategoryCommand)
export class UpdateCategoryHandler implements ICommandHandler<UpdateCategoryCommand> {
  constructor(private readonly service: CategoryService) {}

  async execute(command: UpdateCategoryCommand): Promise<ReadCategoryDto> {
    const updatedCategory = await this.service.updateCategory(
      command.uuid,
      command.dto,
    );

    return {
      uuid: updatedCategory.uuid,
      name: updatedCategory.name,
      description: updatedCategory.description ?? undefined,
      createdAt: updatedCategory.createdAt,
      updatedAt: updatedCategory.updatedAt,
      deletedAt: updatedCategory.deletedAt ?? null,
    };
  }
}
