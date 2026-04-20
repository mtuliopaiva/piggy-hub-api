import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteCategoryCommand } from './delete-category.command';
import { ActionCategoryDto } from '../dtos/action-category.dto';
import { CategoryService } from '../../service/category.service';

@CommandHandler(DeleteCategoryCommand)
export class DeleteCategoryHandler implements ICommandHandler<DeleteCategoryCommand> {
  constructor(private readonly service: CategoryService) {}

  async execute(command: DeleteCategoryCommand): Promise<ActionCategoryDto> {
    await this.service.softDelete(command.uuid, command.actor);

    return { success: true };
  }
}
