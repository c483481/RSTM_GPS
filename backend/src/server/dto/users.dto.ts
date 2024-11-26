import { TYPE_ROLE } from "../../constant/role.constant";
import { BaseResult, UserSession } from "../../module/dto.module";

export type CreateUsers_Payload = {
    noHP: string;
    name: string;
    username: string;
    password: string;
    role: TYPE_ROLE;
};

export type UsersResult = BaseResult & {
    noHP: string;
    name: string;
    username: string;
    role: TYPE_ROLE;
};

export type UpdateUsers_Payload = {
    name: string;
    password: string;
    version: number;
    usersession: UserSession;
};
