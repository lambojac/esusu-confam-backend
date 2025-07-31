import { Model } from 'mongoose';
import { Group, GroupDocument } from './schemas/group.schema';
import { JoinRequestDocument } from './schemas/join-request.schema';
import { UsersService } from '../users/users.service';
import { CreateGroupDto } from './dto/create-group.dto';
export declare class GroupsService {
    private groupModel;
    private joinRequestModel;
    private usersService;
    constructor(groupModel: Model<GroupDocument>, joinRequestModel: Model<JoinRequestDocument>, usersService: UsersService);
    createGroup(createGroupDto: CreateGroupDto, adminId: string): Promise<Group>;
    searchPublicGroups(name?: string): Promise<Group[]>;
    requestToJoin(groupId: string, userId: string): Promise<any>;
    getGroupMembers(groupId: string, adminId: string): Promise<any>;
    getJoinRequests(groupId: string, adminId: string): Promise<any>;
    manageJoinRequest(requestId: string, action: string, adminId: string): Promise<any>;
    joinWithInviteCode(inviteCode: string, userId: string): Promise<any>;
    removeUserFromGroup(groupId: string, userIdToRemove: string, adminId: string): Promise<any>;
    getUserCurrentGroup(userId: string): Promise<any>;
    private generateInviteCode;
}
