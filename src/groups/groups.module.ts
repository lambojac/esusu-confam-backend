import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { Group, GroupSchema } from './schemas/group.schema';
import { JoinRequest, JoinRequestSchema } from './schemas/join-request.schema';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Group.name, schema: GroupSchema },
      { name: JoinRequest.name, schema: JoinRequestSchema },
    ]),
    UsersModule,
  ],
  providers: [GroupsService],
  controllers: [GroupsController],
})
export class GroupsModule {}