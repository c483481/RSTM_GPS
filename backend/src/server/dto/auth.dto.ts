import { UsersResult } from "./users.dto";

export type AuthLogin_Payload = {
    username: string;
    password: string;
};

export type AuthLogin_Result = UsersResult & {
    token: string;
};
