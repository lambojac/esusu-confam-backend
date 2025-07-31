import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Group, GroupDocument } from './schemas/group.schema';
import { JoinRequest, JoinRequestDocument } from './schemas/join-request.schema';
import { UsersService } from '../users/users.service';
import { CreateGroupDto } from './dto/create-group.dto';

@Injectable()
export class GroupsService {
  constructor(
    @InjectModel(Group.name) private groupModel: Model<GroupDocument>,
    @InjectModel(JoinRequest.name) private joinRequestModel: Model<JoinRequestDocument>,
    private usersService: UsersService,
  ) {}

  async createGroup(createGroupDto: CreateGroupDto, adminId: string): Promise<Group> {
    // Check if user is already in a group
    const user = await this.usersService.findById(adminId);
    if (user.currentGroup) {
      throw new BadRequestException('You are already a member of a group');
    }

    // Generate invite code for private groups
    const inviteCode = createGroupDto.visibility === 'private' 
      ? this.generateInviteCode() 
      : undefined;

    const group = new this.groupModel({
      ...createGroupDto,
      admin: adminId,
      members: [adminId],
      inviteCode,
    });

    const savedGroup = await group.save();

    // Update user's current group
    await this.usersService.updateCurrentGroup(adminId, savedGroup._id.toString());

    return savedGroup.populate('admin members');
  }

  async searchPublicGroups(name?: string): Promise<Group[]> {
    const query: any = { visibility: 'public' };
    
    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }

    return this.groupModel
      .find(query)
      .populate('admin', 'name email')
      .populate('members', 'name email')
      .exec();
  }

  async requestToJoin(groupId: string, userId: string): Promise<any> {
    // Check if user is already in a group
    const user = await this.usersService.findById(userId);
    if (user.currentGroup) {
      throw new BadRequestException('You are already a member of a group');
    }

    const group = await this.groupModel.findById(groupId);
    if (!group) {
      throw new NotFoundException('Group not found');
    }

    if (group.visibility !== 'public') {
      throw new BadRequestException('This is not a public group');
    }

    if (group.members.length >= group.maxCapacity) {
      throw new BadRequestException('Group is at maximum capacity');
    }

    // Check if user already has a pending request
    const existingRequest = await this.joinRequestModel.findOne({
      user: userId,
      group: groupId,
      status: 'pending',
    });

    if (existingRequest) {
      throw new BadRequestException('You already have a pending request for this group');
    }

    const joinRequest = new this.joinRequestModel({
      user: userId,
      group: groupId,
    });

    await joinRequest.save();

    return {
      success: true,
      message: 'Join request submitted successfully',
      data: joinRequest,
    };
  }

  async getGroupMembers(groupId: string, adminId: string): Promise<any> {
    const group = await this.groupModel
      .findById(groupId)
      .populate('members', 'name email phoneNumber createdAt');

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    if (group.admin.toString() !== adminId) {
      throw new ForbiddenException('Only group admin can view members');
    }

    return {
      success: true,
      data: {
        group: {
          id: group._id,
          name: group.name,
          description: group.description,
          maxCapacity: group.maxCapacity,
          currentMembers: group.members.length,
        },
        members: group.members,
      },
    };
  }

  async getJoinRequests(groupId: string, adminId: string): Promise<any> {
    const group = await this.groupModel.findById(groupId);
    if (!group) {
      throw new NotFoundException('Group not found');
    }

    if (group.admin.toString() !== adminId) {
      throw new ForbiddenException('Only group admin can view join requests');
    }

    const requests = await this.joinRequestModel
      .find({ group: groupId, status: 'pending' })
      .populate('user', 'name email phoneNumber')
      .sort({ createdAt: -1 });

    return {
      success: true,
      data: requests,
    };
  }

  async manageJoinRequest(requestId: string, action: string, adminId: string): Promise<any> {
    const request = await this.joinRequestModel
      .findById(requestId)
      .populate('group')
      .populate('user');

    if (!request) {
      throw new NotFoundException('Join request not found');
    }

    const group = request.group as any;
    if (group.admin.toString() !== adminId) {
      throw new ForbiddenException('Only group admin can manage join requests');
    }

    if (request.status !== 'pending') {
      throw new BadRequestException('This request has already been processed');
    }

    if (action === 'approved') {
      // Check if group is at capacity
      if (group.members.length >= group.maxCapacity) {
        throw new BadRequestException('Group is at maximum capacity');
      }

      // Check if user is still available (not in another group)
      const user = await this.usersService.findById(request.user._id.toString());
      if (user.currentGroup) {
        throw new BadRequestException('User is already a member of another group');
      }

      // Add user to group
      await this.groupModel.findByIdAndUpdate(group._id, {
        $push: { members: request.user._id },
      });

      // Update user's current group
      await this.usersService.updateCurrentGroup(request.user._id.toString(), group._id.toString());
    }

    // Update request status
    request.status = action;
    await request.save();

    return {
      success: true,
      message: `Join request ${action} successfully`,
      data: request,
    };
  }

  async joinWithInviteCode(inviteCode: string, userId: string): Promise<any> {
    // Check if user is already in a group
    const user = await this.usersService.findById(userId);
    if (user.currentGroup) {
      throw new BadRequestException('You are already a member of a group');
    }

    const group = await this.groupModel.findOne({ inviteCode});
    if (!group) {
      throw new NotFoundException('Invalid invite code');
    }

    if (group.members.length >= group.maxCapacity) {
      throw new BadRequestException('Group is at maximum capacity');
    }

    // Check if user is already a member
    const isMember = group.members.some(memberId => memberId.toString() === userId);
    if (isMember) {
      throw new BadRequestException('You are already a member of this group');
    }

    // Add user to group
    await this.groupModel.findByIdAndUpdate(group._id, {
      $push: { members: userId },
    });

    // Update user's current group
    await this.usersService.updateCurrentGroup(userId, group._id.toString());

    return {
      success: true,
      message: 'Successfully joined the group',
      data: {
        group: {
          id: group._id,
          name: group.name,
          description: group.description,
        },
      },
    };
  }

  async removeUserFromGroup(groupId: string, userIdToRemove: string, adminId: string): Promise<any> {
    const group = await this.groupModel.findById(groupId);
    if (!group) {
      throw new NotFoundException('Group not found');
    }

    if (group.admin.toString() !== adminId) {
      throw new ForbiddenException('Only group admin can remove users');
    }

    if (userIdToRemove === adminId) {
      throw new BadRequestException('Admin cannot remove themselves from the group');
    }

    const isMember = group.members.some(memberId => memberId.toString() === userIdToRemove);
    if (!isMember) {
      throw new BadRequestException('User is not a member of this group');
    }

    // Remove user from group
    await this.groupModel.findByIdAndUpdate(groupId, {
      $pull: { members: userIdToRemove },
    });

    // Update user's current group to null
    await this.usersService.updateCurrentGroup(userIdToRemove, null);

    return {
      success: true,
      message: 'User removed from group successfully',
    };
  }

  async getUserCurrentGroup(userId: string): Promise<any> {
    const user = await this.usersService.findById(userId);
    if (!user.currentGroup) {
      return {
        success: true,
        data: null,
        message: 'User is not a member of any group',
      };
    }

    const group = await this.groupModel
      .findById(user.currentGroup)
      .populate('admin', 'name email')
      .populate('members', 'name email');

    return {
      success: true,
      data: {
        ...group.toObject(),
        isAdmin: group.admin._id.toString() === userId,
        inviteCode: group.admin._id.toString() === userId ? group.inviteCode : undefined,
      },
    };
  }

  private generateInviteCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}