import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersService {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    create(createUserDto: CreateUserDto): Promise<User>;
    findByEmail(email: string): Promise<UserDocument | null>;
    findById(id: string): Promise<UserDocument | null>;
    updateCurrentGroup(userId: string, groupId: string | null): Promise<void>;
    validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean>;
    findByIds(userIds: string[]): Promise<User[]>;
}
