"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const group_schema_1 = require("./schemas/group.schema");
const join_request_schema_1 = require("./schemas/join-request.schema");
const users_service_1 = require("../users/users.service");
let GroupsService = class GroupsService {
    constructor(groupModel, joinRequestModel, usersService) {
        this.groupModel = groupModel;
        this.joinRequestModel = joinRequestModel;
        this.usersService = usersService;
    }
    async createGroup(createGroupDto, adminId) {
        const user = await this.usersService.findById(adminId);
        if (user.currentGroup) {
            throw new common_1.BadRequestException('You are already a member of a group');
        }
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
        await this.usersService.updateCurrentGroup(adminId, savedGroup._id.toString());
        return savedGroup.populate('admin members');
    }
    async searchPublicGroups(name) {
        const query = { visibility: 'public' };
        if (name) {
            query.name = { $regex: name, $options: 'i' };
        }
        return this.groupModel
            .find(query)
            .populate('admin', 'name email')
            .populate('members', 'name email')
            .exec();
    }
    async requestToJoin(groupId, userId) {
        const user = await this.usersService.findById(userId);
        if (user.currentGroup) {
            throw new common_1.BadRequestException('You are already a member of a group');
        }
        const group = await this.groupModel.findById(groupId);
        if (!group) {
            throw new common_1.NotFoundException('Group not found');
        }
        if (group.visibility !== 'public') {
            throw new common_1.BadRequestException('This is not a public group');
        }
        if (group.members.length >= group.maxCapacity) {
            throw new common_1.BadRequestException('Group is at maximum capacity');
        }
        const existingRequest = await this.joinRequestModel.findOne({
            user: userId,
            group: groupId,
            status: 'pending',
        });
        if (existingRequest) {
            throw new common_1.BadRequestException('You already have a pending request for this group');
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
    async getGroupMembers(groupId, adminId) {
        const group = await this.groupModel
            .findById(groupId)
            .populate('members', 'name email phoneNumber createdAt');
        if (!group) {
            throw new common_1.NotFoundException('Group not found');
        }
        if (group.admin.toString() !== adminId) {
            throw new common_1.ForbiddenException('Only group admin can view members');
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
    async getJoinRequests(groupId, adminId) {
        const group = await this.groupModel.findById(groupId);
        if (!group) {
            throw new common_1.NotFoundException('Group not found');
        }
        if (group.admin.toString() !== adminId) {
            throw new common_1.ForbiddenException('Only group admin can view join requests');
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
    async manageJoinRequest(requestId, action, adminId) {
        const request = await this.joinRequestModel
            .findById(requestId)
            .populate('group')
            .populate('user');
        if (!request) {
            throw new common_1.NotFoundException('Join request not found');
        }
        const group = request.group;
        if (group.admin.toString() !== adminId) {
            throw new common_1.ForbiddenException('Only group admin can manage join requests');
        }
        if (request.status !== 'pending') {
            throw new common_1.BadRequestException('This request has already been processed');
        }
        if (action === 'approved') {
            if (group.members.length >= group.maxCapacity) {
                throw new common_1.BadRequestException('Group is at maximum capacity');
            }
            const user = await this.usersService.findById(request.user._id.toString());
            if (user.currentGroup) {
                throw new common_1.BadRequestException('User is already a member of another group');
            }
            await this.groupModel.findByIdAndUpdate(group._id, {
                $push: { members: request.user._id },
            });
            await this.usersService.updateCurrentGroup(request.user._id.toString(), group._id.toString());
        }
        request.status = action;
        await request.save();
        return {
            success: true,
            message: `Join request ${action} successfully`,
            data: request,
        };
    }
    async joinWithInviteCode(inviteCode, userId) {
        const user = await this.usersService.findById(userId);
        if (user.currentGroup) {
            throw new common_1.BadRequestException('You are already a member of a group');
        }
        const group = await this.groupModel.findOne({ inviteCode });
        if (!group) {
            throw new common_1.NotFoundException('Invalid invite code');
        }
        if (group.members.length >= group.maxCapacity) {
            throw new common_1.BadRequestException('Group is at maximum capacity');
        }
        const isMember = group.members.some(memberId => memberId.toString() === userId);
        if (isMember) {
            throw new common_1.BadRequestException('You are already a member of this group');
        }
        await this.groupModel.findByIdAndUpdate(group._id, {
            $push: { members: userId },
        });
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
    async removeUserFromGroup(groupId, userIdToRemove, adminId) {
        const group = await this.groupModel.findById(groupId);
        if (!group) {
            throw new common_1.NotFoundException('Group not found');
        }
        if (group.admin.toString() !== adminId) {
            throw new common_1.ForbiddenException('Only group admin can remove users');
        }
        if (userIdToRemove === adminId) {
            throw new common_1.BadRequestException('Admin cannot remove themselves from the group');
        }
        const isMember = group.members.some(memberId => memberId.toString() === userIdToRemove);
        if (!isMember) {
            throw new common_1.BadRequestException('User is not a member of this group');
        }
        await this.groupModel.findByIdAndUpdate(groupId, {
            $pull: { members: userIdToRemove },
        });
        await this.usersService.updateCurrentGroup(userIdToRemove, null);
        return {
            success: true,
            message: 'User removed from group successfully',
        };
    }
    async getUserCurrentGroup(userId) {
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
    generateInviteCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 8; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
};
exports.GroupsService = GroupsService;
exports.GroupsService = GroupsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(group_schema_1.Group.name)),
    __param(1, (0, mongoose_1.InjectModel)(join_request_schema_1.JoinRequest.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        users_service_1.UsersService])
], GroupsService);
//# sourceMappingURL=groups.service.js.map