import { Order, WhereOptions } from "sequelize";
import { TruckInformationRepository } from "../../contract/repository.contract";
import { AppDataSource } from "../../module/datasource.module";
import { FindResult, List_Payload } from "../../module/dto.module";
import {
    TruckInformation,
    TruckInformationAttributes,
    TruckInformationCreationAttributes,
} from "../model/truck-information.model";
import { BaseRepository } from "./base.repository";

export class SequelizeTruckInformationRepository extends BaseRepository implements TruckInformationRepository {
    private truckInformation!: typeof TruckInformation;

    init(datasource: AppDataSource): void {
        this.truckInformation = datasource.sqlModel.TruckInformation;
    }

    insert = async (payload: TruckInformationCreationAttributes): Promise<TruckInformationAttributes> => {
        return this.truckInformation.create(payload);
    };

    findList = async (payload: List_Payload): Promise<FindResult<TruckInformationAttributes>> => {
        const { showAll, filters } = payload;

        const { order } = this.parseSortBy(payload.sortBy);

        const limit = showAll ? undefined : payload.limit;
        const skip = showAll ? undefined : payload.skip;

        const where: WhereOptions<TruckInformationAttributes> = {};

        if (filters.truckId) {
            where.truckId = filters.truckId;
        }

        return this.truckInformation.findAndCountAll({
            where,
            order,
            limit,
            offset: skip,
        });
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
