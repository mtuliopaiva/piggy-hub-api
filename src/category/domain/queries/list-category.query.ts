export class ListCategoryQuery {
  constructor(
    public readonly data: {
      search?: string;
    },
  ) {}
}
