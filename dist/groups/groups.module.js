"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const groups_service_1 = require("./groups.service");
const groups_controller_1 = require("./groups.controller");
const group_schema_1 = require("./schemas/group.schema");
const join_request_schema_1 = require("./schemas/join-request.schema");
const users_module_1 = require("../users/users.module");
let GroupsModule = class GroupsModule {
};
exports.GroupsModule = GroupsModule;
exports.GroupsModule = GroupsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: group_schema_1.Group.name, schema: group_schema_1.GroupSchema },
                { name: join_request_schema_1.JoinRequest.name, schema: join_request_schema_1.JoinRequestSchema },
            ]),
            users_module_1.UsersModule,
        ],
        providers: [groups_service_1.GroupsService],
        controllers: [groups_controller_1.GroupsController],
    })
], GroupsModule);
//# sourceMappingURL=groups.module.js.map