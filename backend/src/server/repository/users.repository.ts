import { Op, Order, WhereOptions } from "sequelize";
import { UsersRepository } from "../../contract/repository.contract";
import { AppDataSource } from "../../module/datasource.module";
import { FindResult, List_Payload } from "../../module/dto.module";
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

    findList = async (payload: List_Payload): Promise<FindResult<UsersAttributes>> => {
        const { showAll, filters } = payload;

        const { order } = this.parseSortBy(payload.sortBy);

        const limit = showAll ? undefined : payload.limit;
        const skip = showAll ? undefined : payload.skip;

        const where: WhereOptions = {};

        if (filters.username) {
            where.username = {
                [Op.iLike]: `%${filters.username}%`,
            };
        }

        if (filters.role) {
            where.role = filters.role;
        }

        return this.users.findAndCountAll({
            order,
            limit,
            offset: skip,
        });
    };

    createUsers = async (payload: UsersCreationAttributes): Promise<UsersAttributes> => {
        return this.users.create(payload);
    };

    updateUsers = async (id: number, payload: Partial<UsersAttributes>, version: number): Promise<number> => {
        const result = await this.users.update(payload, {
            where: {
                id,
                version,
            },
        });

        return result[0];
    };

    private parseSortBy = (sortBy: string): { order: Order } => {
        // determine sorting option
        let order: Order;
        switch (sortBy) {
            case "createdAt-asc": {
                order = [["createdAt", "ASC"]];
                break;
            }
            case "createdAt-desc": {
                order = [["createdAt", "DESC"]];
                break;
            }
            case "updatedAt-asc": {
                order = [["updatedAt", "ASC"]];
                break;
            }
            case "updatedAt-desc": {
                order = [["updatedAt", "DESC"]];
                break;
            }
            default: {
                order = [["createdAt", "DESC"]];
            }
        }

        return { order };
    };
}
