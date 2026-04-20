export class DeleteCategoryCommand {
  constructor(
    public readonly uuid: string,
    public readonly actor: { uuid: string; email: string },
  ) {}
}
