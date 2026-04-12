import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserService } from '../../service/user.service';
import { UserProfileByUuidQuery } from './userProfile-by-uuid.query';
import { ReadUserProfileDto } from '../dtos/read-userProfile.dto';

@QueryHandler(UserProfileByUuidQuery)
export class UserProfileByUuidHandler implements IQueryHandler<UserProfileByUuidQuery> {
  constructor(private readonly service: UserService) {}

  async execute(query: UserProfileByUuidQuery): Promise<ReadUserProfileDto> {
    const user = await this.service.findUserProfileByUuid(
      query.data.currentUserUuid,
    );

    return {
      uuid: user.uuid,
      userUuid: user.email,
      name: user.userProfile?.name,
      birthDate: user.userProfile?.birthDate,
      avatarUrl: user.userProfile?.avatarUrl,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
