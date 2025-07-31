import { Document, Types } from 'mongoose';
export type GroupDocument = Group & Document;
export declare class Group {
    name: string;
    description: string;
    maxCapacity: number;
    visibility: string;
    admin: Types.ObjectId;
    members: Types.ObjectId[];
    inviteCode: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare const GroupSchema: import("mongoose").Schema<Group, import("mongoose").Model<Group, any, any, any, Document<unknown, any, Group, any, {}> & Group & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Group, Document<unknown, {}, import("mongoose").FlatRecord<Group>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Group> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
