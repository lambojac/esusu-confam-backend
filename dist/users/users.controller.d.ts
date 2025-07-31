import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(user: any): Promise<{
        success: boolean;
        data: {
            [x: string]: any;
        };
    }>;
}
