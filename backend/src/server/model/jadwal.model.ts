import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { CommonColumn } from "../../module/default.module";
import { ModifiedBy } from "../../module/dto.module";
import { BaseSequelizeAttribute, optionalSequelize } from "./common.model";
import { STATUS_JADWAL, TYPE_STATUS_JADWAL } from "../../constant/status-jadwal.constant";
import { Truck, TruckAttributes } from "./truck.model";
import { Users, UsersAttributes } from "./users.model";
import { CheckpointAttributes } from "./checkpoint.model";

const { id, xid, version, modifiedBy, updatedAt, createdAt } = CommonColumn;

export interface JadwalAttributes extends BaseSequelizeAttribute {
    truckId: number;
    driverId: number;
    startDate: Date;
    customer: string;
    destination: string;
    description: string | null;
    status: TYPE_STATUS_JADWAL;
}

export interface JadwalJoinAttributes extends JadwalAttributes {
    truck?: TruckAttributes;
    driver?: UsersAttributes;
    checkpoints?: CheckpointAttributes[];
}

export type JadwalCreationAttributes = Optional<JadwalAttributes, optionalSequelize>;

export class Jadwal extends Model<JadwalAttributes, JadwalCreationAttributes> implements JadwalAttributes {
    xid!: string;
    updatedAt!: Date;
    createdAt!: Date;
    modifiedBy!: ModifiedBy;
    version!: number;
    id!: number;

    truckId!: number;
    driverId!: number;
    startDate!: Date;
    customer!: string;
    destination!: string;
    description!: string | null;
    status!: TYPE_STATUS_JADWAL;

    static initModels(sequelize: Sequelize): typeof Jadwal {
        return Jadwal.init(
            {
                id,
                xid,
                version,
                modifiedBy,
                updatedAt,
                createdAt,
                truckId: {
                    type: DataTypes.BIGINT,
                    allowNull: false,
                    references: {
                        model: Truck,
                        key: "id",
                    },
                },
                driverId: {
                    type: DataTypes.BIGINT,
                    allowNull: false,
                    references: {
                        model: Users,
                        key: "id",
                    },
                },
                startDate: {
                    type: DataTypes.DATE,
                    allowNull: false,
                },
                customer: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                destination: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                description: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                status: {
                    type: DataTypes.ENUM(
                        STATUS_JADWAL.ONPROGRESS,
                        STATUS_JADWAL.DONE,
                        STATUS_JADWAL.PENDING,
                        STATUS_JADWAL.CANCEL
                    ),
                    allowNull: false,
                },
            },
            {
                sequelize,
                tableName: "jadwal",
                timestamps: false,
            }
        );
    }
}
