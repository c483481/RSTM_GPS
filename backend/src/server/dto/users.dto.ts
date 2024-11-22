import { TYPE_ROLE } from "../../constant/role.constant";
import { BaseResult } from "../../module/dto.module";

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
