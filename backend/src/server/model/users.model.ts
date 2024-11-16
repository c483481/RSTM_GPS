import { CommonColumn } from "../../module/default.module";
import { ModifiedBy } from "../../module/dto.module";
import { Optional, Model, Sequelize, DataTypes } from "sequelize";
import { BaseSequelizeAttribute, optionalSequelize } from "./common.model";
import { TYPE_ROLE } from "../../constant/role.constant";

const { id, xid, version, modifiedBy, updatedAt, createdAt } = CommonColumn;

export interface UsersAttributes extends BaseSequelizeAttribute {
    noHP: string;
    username: string;
    password: string;
    role: TYPE_ROLE;
}

export type UsersCreationAttributes = Optional<UsersAttributes, optionalSequelize>;

export class Users extends Model<UsersAttributes, UsersCreationAttributes> implements UsersAttributes {
    xid!: string;
    updatedAt!: Date;
    createdAt!: Date;
    modifiedBy!: ModifiedBy;
    version!: number;
    id!: number;

    noHP!: string;
    username!: string;
    password!: string;
    role!: TYPE_ROLE;

    static initModels(sequelize: Sequelize): typeof Users {
        return Users.init(
            {
                id,
                xid,
                version,
                modifiedBy,
                updatedAt,
                createdAt,
                username: {
                    type: DataTypes.STRING(255),
                    allowNull: false,
                    unique: true,
                },
                noHP: {
                    type: DataTypes.STRING(15),
                    allowNull: false,
                    unique: true,
                },
                role: {
                    type: DataTypes.STRING(10),
                    allowNull: false,
                },
                password: {
                    type: DataTypes.STRING(255),
                    allowNull: false,
                },
            },
            {
                sequelize,
                tableName: "users",
                timestamps: false,
            }
        );
    }
}
