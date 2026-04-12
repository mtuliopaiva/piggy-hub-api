import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserService } from '../../service/user.service';
import { UpdateUserCommand } from './update-user.command';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UpdateUserProfileCommand } from './update-userProfile.command';
import { UpdateUserProfileDto } from '../dtos/update-userProfile.dto';

@CommandHandler(UpdateUserProfileCommand)
export class UpdateUserProfileHandler implements ICommandHandler<UpdateUserProfileCommand> {
  constructor(private readonly service: UserService) {}

  async execute(
    command: UpdateUserProfileCommand,
  ): Promise<UpdateUserProfileDto> {
    const updatedUserProfile = await this.service.updateUserProfile(
      command.data.currentUserUuid,
      command.data.dto,
    );

    return {
      name: updatedUserProfile.userProfile?.name,
      birthDate: updatedUserProfile.userProfile?.birthDate,
      avatarUrl: updatedUserProfile.userProfile?.avatarUrl,
    };
  }
}
