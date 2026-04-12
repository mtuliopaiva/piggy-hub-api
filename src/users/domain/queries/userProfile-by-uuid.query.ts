export class UserProfileByUuidQuery {
  constructor(
    public readonly data: {
      currentUserUuid: string;
    },
  ) {}
}
