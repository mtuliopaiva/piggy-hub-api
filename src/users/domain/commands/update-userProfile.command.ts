import { UpdateUserProfileDto } from '../dtos/update-userProfile.dto';

export class UpdateUserProfileCommand {
  constructor(
    public readonly data: {
      currentUserUuid: string;
      dto: UpdateUserProfileDto;
    },
  ) {}
}
