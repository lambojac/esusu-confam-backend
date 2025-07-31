import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { JoinRequestDto } from './dto/join-request.dto';
import { ManageRequestDto } from './dto/manage-request.dto';
import { InviteUserDto } from './dto/invite-user.dto';
export declare class GroupsController {
    private readonly groupsService;
    constructor(groupsService: GroupsService);
    createGroup(createGroupDto: CreateGroupDto, user: any): Promise<{
        success: boolean;
        message: string;
        data: import("./schemas/group.schema").Group;
    }>;
    searchPublicGroups(name?: string): Promise<{
        success: boolean;
        data: import("./schemas/group.schema").Group[];
    }>;
    getCurrentGroup(user: any): Promise<any>;
    requestToJoin(joinRequestDto: JoinRequestDto, user: any): Promise<any>;
    joinWithInviteCode(inviteUserDto: InviteUserDto, user: any): Promise<any>;
    getGroupMembers(groupId: string, user: any): Promise<any>;
    getJoinRequests(groupId: string, user: any): Promise<any>;
    manageJoinRequest(manageRequestDto: ManageRequestDto, user: any): Promise<any>;
    removeUser(groupId: string, userId: string, user: any): Promise<any>;
}
