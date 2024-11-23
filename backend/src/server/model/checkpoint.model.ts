import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { BaseSequelizeAttribute, optionalSequelize } from "./common.model";
import { CommonColumn } from "../../module/default.module";
import { ModifiedBy } from "../../module/dto.module";
import { Jadwal } from "./jadwal.model";

const { id, xid, version, modifiedBy, updatedAt, createdAt } = CommonColumn;

export interface CheckpointAttributes extends BaseSequelizeAttribute {
    jadwalId: number;
    checkpoint: string;
    order: number;
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
            },
            {
                sequelize,
                tableName: "checkpoint",
                timestamps: false,
            }
        );
    }
}
