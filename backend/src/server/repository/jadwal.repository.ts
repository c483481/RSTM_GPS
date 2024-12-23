import { Op, Order, WhereOptions } from "sequelize";
import { AppDataSource } from "../../module/datasource.module";
import { FindResult, List_Payload } from "../../module/dto.module";
import { Jadwal, JadwalAttributes, JadwalCreationAttributes, JadwalJoinAttributes } from "../model/jadwal.model";
import { BaseRepository } from "./base.repository";
import { JadwalRepository } from "../../contract/repository.contract";
import { Truck } from "../model/truck.model";
import { Users, UsersAttributes } from "../model/users.model";
import { Checkpoint } from "../model/checkpoint.model";

export class SequelizeJadwalRepository extends BaseRepository implements JadwalRepository {
    private jadwal!: typeof Jadwal;
    init(datasource: AppDataSource): void {
        this.jadwal = datasource.sqlModel.Jadwal;
    }

    findByXid = async (xid: string): Promise<JadwalJoinAttributes | null> => {
        return this.jadwal.findOne({
            where: {
                xid,
            },
            include: [
                {
                    model: Truck,
                    as: "truck",
                    foreignKey: "truckId",
                },
                {
                    model: Users,
                    as: "driver",
                    foreignKey: "driverId",
                },
                {
                    model: Checkpoint,
                    as: "checkpoints",
                    foreignKey: "jadwalId",
                },
            ],
        });
    };

    createJadwal = async (data: JadwalCreationAttributes): Promise<JadwalAttributes> => {
        return this.jadwal.create(data);
    };

    udpateJadwal = async (id: number, data: Partial<JadwalAttributes>, version: number): Promise<number> => {
        const result = await this.jadwal.update(data, {
            where: {
                id,
                version,
            },
        });

        return result[0];
    };

    deleteJadwal = async (id: number): Promise<number> => {
        const result = await this.jadwal.destroy({
            where: {
                id,
            },
        });

        return result;
    };

    findList = async (payload: List_Payload): Promise<FindResult<JadwalJoinAttributes>> => {
        const { showAll, filters } = payload;

        const { order } = this.parseSortBy(payload.sortBy);

        const limit = showAll ? undefined : payload.limit;
        const skip = showAll ? undefined : payload.skip;

        const where: WhereOptions<JadwalAttributes> = {};
        const whereUser: WhereOptions<UsersAttributes> = {};
        if (filters.startAt && filters.endAt) {
            const startAtDate = new Date(Number(filters.startAt) * 1000);
            const endAtDate = new Date(Number(filters.endAt) * 1000);

            where.startDate = {
                [Op.between]: [startAtDate.toISOString(), endAtDate.toISOString()],
            };
        }

        if (filters.status) {
            where.status = filters.status;
        }

        if (filters.notStatus) {
            where.status = {
                [Op.ne]: filters.notStatus,
            };
        }

        if (filters.driverXid) {
            whereUser.xid = filters.driverXid;
        }

        return this.jadwal.findAndCountAll({
            where,
            order,
            limit,
            offset: skip,
            include: [
                {
                    model: Truck,
                    as: "truck",
                    foreignKey: "truckId",
                },
                {
                    model: Users,
                    as: "driver",
                    foreignKey: "driverId",
                    where: whereUser,
                },
                {
                    model: Checkpoint,
                    as: "checkpoints",
                    foreignKey: "jadwalId",
                },
            ],
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
