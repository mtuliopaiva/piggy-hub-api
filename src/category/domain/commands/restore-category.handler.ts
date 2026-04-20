import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RestoreCategoryCommand } from './restore-category.command';
import { CategoryService } from '../../service/category.service';
import { ActionCategoryDto } from '../dtos/action-category.dto';

@CommandHandler(RestoreCategoryCommand)
export class RestoreCategoryHandler implements ICommandHandler<RestoreCategoryCommand> {
  constructor(private readonly service: CategoryService) {}

  async execute(command: RestoreCategoryCommand): Promise<ActionCategoryDto> {
    await this.service.restore(command.uuid, command.actor);

    return { success: true };
  }
}
