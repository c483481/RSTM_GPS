import { TYPE_ROLE } from "../../constant/role.constant";
import { BaseResult } from "../../module/dto.module";

export type UsersResult = BaseResult & {
    noHP: string;
    username: string;
    role: TYPE_ROLE;
};
