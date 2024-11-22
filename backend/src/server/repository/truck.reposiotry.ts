import { Order } from "sequelize";
import { TruckRepository } from "../../contract/repository.contract";
import { AppDataSource } from "../../module/datasource.module";
import { FindResult, List_Payload } from "../../module/dto.module";
import { Truck, TruckAttributes, TruckCreationAttributes } from "../model/truck.model";
import { BaseRepository } from "./base.repository";

export class SequelizeTruckRepository extends BaseRepository implements TruckRepository {
    private truck!: typeof Truck;
    init(datasource: AppDataSource): void {
        this.truck = datasource.sqlModel.Truck;
    }

    findByPlatNomor = async (platNomor: string): Promise<TruckAttributes | null> => {
        return this.truck.findOne({
            where: {
                platNomor,
            },
        });
    };

    findByXid = async (xid: string): Promise<TruckAttributes | null> => {
        return this.truck.findOne({
            where: {
                xid,
            },
        });
    };

    findTruckCount = async (): Promise<number> => {
        return this.truck.count();
    };

    findList = async (payload: List_Payload): Promise<FindResult<TruckAttributes>> => {
        const { showAll } = payload;

        const { order } = this.parseSortBy(payload.sortBy);

        const limit = showAll ? undefined : payload.limit;
        const skip = showAll ? undefined : payload.skip;

        return this.truck.findAndCountAll({
            order,
            limit,
            offset: skip,
        });
    };

    createTruck = async (payload: TruckCreationAttributes): Promise<TruckAttributes> => {
        return this.truck.create(payload);
    };

    updateTruck = async (id: number, payload: Partial<TruckAttributes>, version: number): Promise<number> => {
        const result = await this.truck.update(payload, {
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
