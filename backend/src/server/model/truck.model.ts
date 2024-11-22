import { CommonColumn } from "../../module/default.module";
import { ModifiedBy } from "../../module/dto.module";
import { Optional, Model, Sequelize, DataTypes } from "sequelize";
import { BaseSequelizeAttribute, optionalSequelize } from "./common.model";
import { TYPE_STATUS } from "../../constant/status.constant";

const { id, xid, version, modifiedBy, updatedAt, createdAt } = CommonColumn;

export interface TruckAttributes extends BaseSequelizeAttribute {
    namaTruck: string;
    platNomor: string;
    deskripsi: string;
    status: TYPE_STATUS;
    estimasiDone: Date | null;
}

export type TruckCreationAttributes = Optional<TruckAttributes, optionalSequelize>;

export class Truck extends Model<TruckAttributes, TruckCreationAttributes> implements TruckAttributes {
    xid!: string;
    updatedAt!: Date;
    createdAt!: Date;
    modifiedBy!: ModifiedBy;
    version!: number;
    id!: number;

    platNomor!: string;
    deskripsi!: string;
    status!: TYPE_STATUS;
    estimasiDone!: Date | null;
    namaTruck!: string;

    static initModels(sequelize: Sequelize): typeof Truck {
        return Truck.init(
            {
                id,
                xid,
                version,
                modifiedBy,
                updatedAt,
                createdAt,
                namaTruck: {
                    type: DataTypes.STRING(255),
                    allowNull: false,
                    unique: true,
                },
                platNomor: {
                    type: DataTypes.STRING(255),
                    allowNull: false,
                    unique: true,
                },
                deskripsi: {
                    type: DataTypes.STRING(255),
                    allowNull: false,
                },
                status: {
                    type: DataTypes.STRING(15),
                    allowNull: false,
                },
                estimasiDone: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
            },
            {
                sequelize,
                tableName: "truck",
                timestamps: false,
            }
        );
    }
}
