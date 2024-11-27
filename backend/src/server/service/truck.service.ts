import { isValid, ulid } from "ulidx";
import { STATUS } from "../../constant/status.constant";
import { AppRepositoryMap, TruckRepository } from "../../contract/repository.contract";
import { compose, composeResult, createData, updateData } from "../../utils/helper.utils";
import { CreateTruck_Payload, TruckResult, UpdateLocation_Payload, UpdateTruck_Payload } from "../dto/truck.dto";
import { TruckAttributes, TruckCreationAttributes } from "../model/truck.model";
import { BaseService } from "./base.service";
import { errorResponses } from "../../response";
import { GetDetail_Payload, List_Payload, ListResult } from "../../module/dto.module";
import { TruckService } from "../../contract/service.contract";
import { toUnixEpoch } from "../../utils/date.utils";
import fs from "fs";

export class Truck extends BaseService implements TruckService {
    private truckRepo!: TruckRepository;

    init(repository: AppRepositoryMap): void {
        this.truckRepo = repository.truck;
    }

    getDetail = async (payload: GetDetail_Payload): Promise<TruckResult> => {
        if (!isValid(payload.xid)) {
            throw errorResponses.getError("E_FOUND_1");
        }

        const truck = await this.truckRepo.findByXid(payload.xid);

        if (!truck) {
            throw errorResponses.getError("E_FOUND_1");
        }

        return composeTruck(truck);
    };

    getList = async (payload: List_Payload): Promise<ListResult<TruckResult>> => {
        const result = await this.truckRepo.findList(payload);

        const items = compose(result.rows, composeTruck);

        return {
            items,
            count: result.count,
        };
    };

    createTruck = async (payload: CreateTruck_Payload): Promise<TruckResult> => {
        const { nama, platNomor, userSession, truckImg } = payload;

        const img = `/public/${ulid()}.jpg`;
        await truckImg.mv(`.${img}`);

        const createdValue = createData<TruckCreationAttributes>(
            {
                namaTruck: nama,
                platNomor: platNomor,
                deskripsi: "Truck Tersedia",
                status: STATUS.TERSEDIA,
                estimasiDone: null,
                truckImg: img,
                truckMaintenanceImg: null,
            },
            userSession
        );

        const result = await this.truckRepo.createTruck(createdValue);

        return composeTruck(result);
    };

    updateTruck = async (payload: UpdateTruck_Payload): Promise<TruckResult> => {
        const { xid, status, estimasiDone, deskripsi, userSession, version, maintananceImg } = payload;
        if (!isValid(xid)) {
            throw errorResponses.getError("E_FOUND_1");
        }

        const truck = await this.truckRepo.findByXid(xid);

        if (!truck) {
            throw errorResponses.getError("E_FOUND_1");
        }

        let estimasiDoneDate: Date | null = null;
        let maintananceImgUrl: string | null = null;
        if (estimasiDone) {
            const timestamp = new Date(estimasiDone * 1000);
            estimasiDoneDate = new Date(
                Date.UTC(
                    timestamp.getUTCFullYear(),
                    timestamp.getUTCMonth(),
                    timestamp.getUTCDate(),
                    timestamp.getUTCHours(),
                    timestamp.getUTCMinutes(),
                    timestamp.getUTCSeconds(),
                    timestamp.getUTCMilliseconds()
                )
            );

            if (maintananceImg) {
                maintananceImgUrl = `/public/${ulid()}.jpg`;
                await maintananceImg.mv(`.${maintananceImgUrl}`);
            }

            if (truck.truckMaintenanceImg) {
                fs.unlinkSync(`.${truck.truckMaintenanceImg}`);
            }
        }

        const updatedValue = updateData<TruckAttributes>(
            truck,
            {
                status,
                estimasiDone: estimasiDoneDate,
                deskripsi,
                truckMaintenanceImg: maintananceImgUrl,
            },
            userSession
        );

        const result = await this.truckRepo.updateTruck(truck.id, updatedValue, version);

        if (!result) {
            throw errorResponses.getError("E_REQ_2");
        }

        Object.assign(truck, updatedValue);

        return composeTruck(truck);
    };

    updateLocation = async (payload: UpdateLocation_Payload): Promise<void> => {
        const { xid, latitude, longitude, battery } = payload;

        if (!isValid(xid)) {
            throw errorResponses.getError("E_FOUND_1");
        }

        const truck = await this.truckRepo.findByXid(xid);

        if (!truck) {
            throw errorResponses.getError("E_FOUND_1");
        }

        console.table({ xid, latitude, longitude, battery });

        this.truckRepo.updateLocation(payload);
    };
}

export function composeTruck(row: TruckAttributes): TruckResult {
    return composeResult(row, {
        nama: row.deskripsi,
        platNomor: row.platNomor,
        deskripsi: row.deskripsi,
        status: row.status,
        estimasiDone: row.estimasiDone ? toUnixEpoch(row.estimasiDone) : null,
    });
}
