export class CategoryEntity {
  uuid: string;
  name: string;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
