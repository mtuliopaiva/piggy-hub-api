import { UpdateCategoryDto } from '../dtos/update-category.dto';

export class UpdateCategoryCommand {
  constructor(
    public readonly uuid: string,
    public readonly dto: UpdateCategoryDto,
  ) {}
}
