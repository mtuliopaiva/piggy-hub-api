export class CreateCategoryCommand {
  constructor(
    public readonly data: {
      name: string;
      description: string;
    },
  ) {}
}
