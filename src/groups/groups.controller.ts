import { 
  Controller, 
  Post, 
  Get, 
  Body, 
  Query, 
  Param, 
  UseGuards, 
  Delete 
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiBearerAuth, 
  ApiResponse, 
  ApiQuery 
} from '@nestjs/swagger';
import { GroupsService } from './groups.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { CreateGroupDto } from './dto/create-group.dto';
import { JoinRequestDto } from './dto/join-request.dto';
import { ManageRequestDto } from './dto/manage-request.dto';
import { InviteUserDto } from './dto/invite-user.dto';

@ApiTags('Groups')
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new group' })
  @ApiResponse({ status: 201, description: 'Group created successfully' })
  @ApiResponse({ status: 400, description: 'User already in a group' })
  async createGroup(@Body() createGroupDto: CreateGroupDto, @GetUser() user: any) {
    const group = await this.groupsService.createGroup(createGroupDto, user.id);
    return {
      success: true,
      message: 'Group created successfully',
      data: group,
    };
  }

  @Get('search')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Search public groups' })
  @ApiQuery({ name: 'name', required: false, description: 'Group name to search for' })
  @ApiResponse({ status: 200, description: 'Public groups retrieved successfully' })
  async searchPublicGroups(@Query('name') name?: string) {
    const groups = await this.groupsService.searchPublicGroups(name);
    return {
      success: true,
      data: groups,
    };
  }

  @Get('my-group')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user group' })
  @ApiResponse({ status: 200, description: 'User group retrieved successfully' })
  async getCurrentGroup(@GetUser() user: any) {
    return this.groupsService.getUserCurrentGroup(user.id);
  }

  @Post('request-join')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Request to join a public group' })
  @ApiResponse({ status: 201, description: 'Join request submitted successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async requestToJoin(@Body() joinRequestDto: JoinRequestDto, @GetUser() user: any) {
    return this.groupsService.requestToJoin(joinRequestDto.groupId, user.id);
  }

  @Post('join-with-code')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Join private group with invite code' })
  @ApiResponse({ status: 200, description: 'Successfully joined group' })
  @ApiResponse({ status: 404, description: 'Invalid invite code' })
  async joinWithInviteCode(@Body() inviteUserDto: InviteUserDto, @GetUser() user: any) {
    return this.groupsService.joinWithInviteCode(inviteUserDto.inviteCode, user.id);
  }

  @Get(':id/members')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get group members (Admin only)' })
  @ApiResponse({ status: 200, description: 'Group members retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Only admin can view members' })
  async getGroupMembers(@Param('id') groupId: string, @GetUser() user: any) {
    return this.groupsService.getGroupMembers(groupId, user.id);
  }

  @Get(':id/join-requests')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get pending join requests (Admin only)' })
  @ApiResponse({ status: 200, description: 'Join requests retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Only admin can view join requests' })
  async getJoinRequests(@Param('id') groupId: string, @GetUser() user: any) {
    return this.groupsService.getJoinRequests(groupId, user.id);
  }

  @Post('manage-request')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Approve or reject join request (Admin only)' })
  @ApiResponse({ status: 200, description: 'Request processed successfully' })
  @ApiResponse({ status: 403, description: 'Only admin can manage requests' })
  async manageJoinRequest(@Body() manageRequestDto: ManageRequestDto, @GetUser() user: any) {
    return this.groupsService.manageJoinRequest(
      manageRequestDto.requestId,
      manageRequestDto.action,
      user.id,
    );
  }

  @Delete(':groupId/members/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove user from group (Admin only)' })
  @ApiResponse({ status: 200, description: 'User removed successfully' })
  @ApiResponse({ status: 403, description: 'Only admin can remove users' })
  async removeUser(
    @Param('groupId') groupId: string,
    @Param('userId') userId: string,
    @GetUser() user: any,
  ) {
    return this.groupsService.removeUserFromGroup(groupId, userId, user.id);
  }
}
