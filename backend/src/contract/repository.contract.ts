import { UsersCreationAttributes, UsersAttributes } from "../server/model/users.model";

export interface AppRepositoryMap {
    users: UsersRepository;
}

export interface UsersRepository {
    findByUsername(username: string): Promise<UsersAttributes | null>;

    findByXid(xid: string): Promise<UsersAttributes | null>;

    findUsersCount(): Promise<number>;

    createUsers(payload: UsersCreationAttributes): Promise<UsersAttributes>;
}
