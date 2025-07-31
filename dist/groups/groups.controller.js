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
exports.GroupsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const groups_service_1 = require("./groups.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const get_user_decorator_1 = require("../common/decorators/get-user.decorator");
const create_group_dto_1 = require("./dto/create-group.dto");
const join_request_dto_1 = require("./dto/join-request.dto");
const manage_request_dto_1 = require("./dto/manage-request.dto");
const invite_user_dto_1 = require("./dto/invite-user.dto");
let GroupsController = class GroupsController {
    constructor(groupsService) {
        this.groupsService = groupsService;
    }
    async createGroup(createGroupDto, user) {
        const group = await this.groupsService.createGroup(createGroupDto, user.id);
        return {
            success: true,
            message: 'Group created successfully',
            data: group,
        };
    }
    async searchPublicGroups(name) {
        const groups = await this.groupsService.searchPublicGroups(name);
        return {
            success: true,
            data: groups,
        };
    }
    async getCurrentGroup(user) {
        return this.groupsService.getUserCurrentGroup(user.id);
    }
    async requestToJoin(joinRequestDto, user) {
        return this.groupsService.requestToJoin(joinRequestDto.groupId, user.id);
    }
    async joinWithInviteCode(inviteUserDto, user) {
        return this.groupsService.joinWithInviteCode(inviteUserDto.inviteCode, user.id);
    }
    async getGroupMembers(groupId, user) {
        return this.groupsService.getGroupMembers(groupId, user.id);
    }
    async getJoinRequests(groupId, user) {
        return this.groupsService.getJoinRequests(groupId, user.id);
    }
    async manageJoinRequest(manageRequestDto, user) {
        return this.groupsService.manageJoinRequest(manageRequestDto.requestId, manageRequestDto.action, user.id);
    }
    async removeUser(groupId, userId, user) {
        return this.groupsService.removeUserFromGroup(groupId, userId, user.id);
    }
};
exports.GroupsController = GroupsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new group' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Group created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'User already in a group' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_group_dto_1.CreateGroupDto, Object]),
    __metadata("design:returntype", Promise)
], GroupsController.prototype, "createGroup", null);
__decorate([
    (0, common_1.Get)('search'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Search public groups' }),
    (0, swagger_1.ApiQuery)({ name: 'name', required: false, description: 'Group name to search for' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Public groups retrieved successfully' }),
    __param(0, (0, common_1.Query)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GroupsController.prototype, "searchPublicGroups", null);
__decorate([
    (0, common_1.Get)('my-group'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user group' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User group retrieved successfully' }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GroupsController.prototype, "getCurrentGroup", null);
__decorate([
    (0, common_1.Post)('request-join'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Request to join a public group' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Join request submitted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [join_request_dto_1.JoinRequestDto, Object]),
    __metadata("design:returntype", Promise)
], GroupsController.prototype, "requestToJoin", null);
__decorate([
    (0, common_1.Post)('join-with-code'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Join private group with invite code' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Successfully joined group' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Invalid invite code' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [invite_user_dto_1.InviteUserDto, Object]),
    __metadata("design:returntype", Promise)
], GroupsController.prototype, "joinWithInviteCode", null);
__decorate([
    (0, common_1.Get)(':id/members'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get group members (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Group members retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Only admin can view members' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], GroupsController.prototype, "getGroupMembers", null);
__decorate([
    (0, common_1.Get)(':id/join-requests'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get pending join requests (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Join requests retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Only admin can view join requests' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], GroupsController.prototype, "getJoinRequests", null);
__decorate([
    (0, common_1.Post)('manage-request'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Approve or reject join request (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Request processed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Only admin can manage requests' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [manage_request_dto_1.ManageRequestDto, Object]),
    __metadata("design:returntype", Promise)
], GroupsController.prototype, "manageJoinRequest", null);
__decorate([
    (0, common_1.Delete)(':groupId/members/:userId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Remove user from group (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User removed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Only admin can remove users' }),
    __param(0, (0, common_1.Param)('groupId')),
    __param(1, (0, common_1.Param)('userId')),
    __param(2, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], GroupsController.prototype, "removeUser", null);
exports.GroupsController = GroupsController = __decorate([
    (0, swagger_1.ApiTags)('Groups'),
    (0, common_1.Controller)('groups'),
    __metadata("design:paramtypes", [groups_service_1.GroupsService])
], GroupsController);
//# sourceMappingURL=groups.controller.js.map