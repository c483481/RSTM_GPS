import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { CommonColumn } from "../../module/default.module";
import { ModifiedBy } from "../../module/dto.module";
import { BaseSequelizeAttribute, optionalSequelize } from "./common.model";
import { Truck } from "./truck.model";

const { id, xid, version, modifiedBy, updatedAt, createdAt } = CommonColumn;

export interface TruckInformationAttributes extends BaseSequelizeAttribute {
    truckId: number;
    latitude: number;
    longitude: number;
    battrey: number;
}

export type TruckInformationCreationAttributes = Optional<TruckInformationAttributes, optionalSequelize>;

export class TruckInformation
    extends Model<TruckInformationAttributes, TruckInformationCreationAttributes>
    implements TruckInformationAttributes
{
    xid!: string;
    updatedAt!: Date;
    createdAt!: Date;
    modifiedBy!: ModifiedBy;
    version!: number;
    id!: number;

    truckId!: number;
    latitude!: number;
    longitude!: number;
    battrey!: number;

    static initModels(sequelize: Sequelize): typeof TruckInformation {
        return TruckInformation.init(
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
                latitude: {
                    type: DataTypes.DECIMAL(9, 6),
                    allowNull: false,
                },
                longitude: {
                    type: DataTypes.DECIMAL(9, 6),
                    allowNull: false,
                },
                battrey: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
            },
            {
                sequelize,
                tableName: "truck_information",
                timestamps: false,
            }
        );
    }
}
