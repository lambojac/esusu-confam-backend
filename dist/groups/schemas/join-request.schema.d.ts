import { Document, Types } from 'mongoose';
export type JoinRequestDocument = JoinRequest & Document;
export declare class JoinRequest {
    user: Types.ObjectId;
    group: Types.ObjectId;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare const JoinRequestSchema: import("mongoose").Schema<JoinRequest, import("mongoose").Model<JoinRequest, any, any, any, Document<unknown, any, JoinRequest, any, {}> & JoinRequest & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, JoinRequest, Document<unknown, {}, import("mongoose").FlatRecord<JoinRequest>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<JoinRequest> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
