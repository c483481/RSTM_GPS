import { UsersRepository } from "../../contract/repository.contract";
import { AppDataSource } from "../../module/datasource.module";
import { Users, UsersAttributes, UsersCreationAttributes } from "../model/users.model";
import { BaseRepository } from "./base.repository";

export class SequelizeUsersRepository extends BaseRepository implements UsersRepository {
    private users!: typeof Users;
    init(datasource: AppDataSource): void {
        this.users = datasource.sqlModel.Users;
    }

    findByUsername = async (username: string): Promise<UsersAttributes | null> => {
        return this.users.findOne({
            where: {
                username,
            },
        });
    };

    findByXid = async (xid: string): Promise<UsersAttributes | null> => {
        return this.users.findOne({
            where: {
                xid,
            },
        });
    };

    findUsersCount = async (): Promise<number> => {
        return this.users.count();
    };

    createUsers = async (payload: UsersCreationAttributes): Promise<UsersAttributes> => {
        return this.users.create(payload);
    };
}
