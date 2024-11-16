import { composeResult } from "../../utils/helper.utils";
import { UsersResult } from "../dto/users.dto";
import { UsersAttributes } from "../model/users.model";

export function composeUsers(row: UsersAttributes): UsersResult {
    return composeResult(row, {
        noHP: row.noHP,
        username: row.username,
        role: row.role,
    });
}
