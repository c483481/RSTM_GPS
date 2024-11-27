import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { BaseSequelizeAttribute, optionalSequelize } from "./common.model";
import { CommonColumn } from "../../module/default.module";
import { ModifiedBy } from "../../module/dto.module";
import { Jadwal } from "./jadwal.model";
import { STATUS_JADWAL, TYPE_STATUS_JADWAL } from "../../constant/status-jadwal.constant";

const { id, xid, version, modifiedBy, updatedAt, createdAt } = CommonColumn;

export interface CheckpointAttributes extends BaseSequelizeAttribute {
    jadwalId: number;
    checkpoint: string;
    order: number;
    status: TYPE_STATUS_JADWAL;
}

export type CheckpointCreationAttributes = Optional<CheckpointAttributes, optionalSequelize>;

export class Checkpoint
    extends Model<CheckpointAttributes, CheckpointCreationAttributes>
    implements CheckpointAttributes
{
    xid!: string;
    updatedAt!: Date;
    createdAt!: Date;
    modifiedBy!: ModifiedBy;
    version!: number;
    id!: number;

    jadwalId!: number;
    checkpoint!: string;
    order!: number;
    status!: TYPE_STATUS_JADWAL;

    static initModels(sequelize: Sequelize): typeof Checkpoint {
        return Checkpoint.init(
            {
                id,
                xid,
                version,
                modifiedBy,
                updatedAt,
                createdAt,
                jadwalId: {
                    type: DataTypes.BIGINT,
                    allowNull: false,
                    references: {
                        model: Jadwal,
                        key: "id",
                    },
                },
                checkpoint: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                order: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
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
                tableName: "checkpoint",
                timestamps: false,
            }
        );
    }
}
