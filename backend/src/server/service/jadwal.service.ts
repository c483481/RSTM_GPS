import { isValid } from "ulidx";
import {
    AppRepositoryMap,
    JadwalRepository,
    TruckRepository,
    UsersRepository,
} from "../../contract/repository.contract";
import { GetDetail_Payload, List_Payload, ListResult } from "../../module/dto.module";
import { toUnixEpoch } from "../../utils/date.utils";
import { compose, composeResult, createData, updateData } from "../../utils/helper.utils";
import { CreateJadwal_Payload, JadwalResult, PatchJadwal_Payload } from "../dto/jadwal.dto";
import { JadwalAttributes, JadwalCreationAttributes, JadwalJoinAttributes } from "../model/jadwal.model";
import { BaseService } from "./base.service";
import { composeTruck } from "./truck.service";
import { composeUsers } from "./users.service";
import { errorResponses } from "../../response";
import { STATUS_JADWAL } from "../../constant/status-jadwal.constant";
import { JadwalService } from "../../contract/service.contract";
import { STATUS } from "../../constant/status.constant";
import { ROLE } from "../../constant/role.constant";
import { composeCheckpoint } from "./checkpoint.service";

export class Jadwal extends BaseService implements JadwalService {
    private truckRepository!: TruckRepository;
    private userRepository!: UsersRepository;
    private jadwalRepository!: JadwalRepository;
    init(repository: AppRepositoryMap): void {
        this.truckRepository = repository.truck;
        this.userRepository = repository.users;
        this.jadwalRepository = repository.jadwal;
    }

    getDetail = async (payload: GetDetail_Payload): Promise<JadwalResult> => {
        const { xid } = payload;
        if (!isValid(xid)) {
            throw errorResponses.getError("E_FOUND_1");
        }

        const result = await this.jadwalRepository.findByXid(xid);

        if (!result) {
            throw errorResponses.getError("E_FOUND_1");
        }

        return composeJadwal(result);
    };

    getList = async (payload: List_Payload): Promise<ListResult<JadwalResult>> => {
        const result = await this.jadwalRepository.findList(payload);

        const items = compose(result.rows, composeJadwal);

        return {
            items,
            count: result.count,
        };
    };

    createJadwal = async (payload: CreateJadwal_Payload): Promise<JadwalResult> => {
        if (!isValid(payload.truckXid) || !isValid(payload.driverXid)) {
            throw errorResponses.getError("E_FOUND_1");
        }

        const truck = await this.truckRepository.findByXid(payload.truckXid);

        if (!truck) {
            throw errorResponses.getError("E_FOUND_1");
        }

        if (truck.status !== STATUS.TERSEDIA) {
            throw errorResponses.getError("E_FOUND_1");
        }

        const driver = await this.userRepository.findByXid(payload.driverXid);

        if (!driver) {
            throw errorResponses.getError("E_FOUND_1");
        }

        if (driver.role !== ROLE.DRIVER) {
            throw errorResponses.getError("E_FOUND_1");
        }

        const createValues = createData<JadwalCreationAttributes>({
            truckId: truck.id,
            driverId: driver.id,
            startDate: new Date(payload.tanggal * 1000),
            customer: payload.customer,
            destination: payload.destination,
            description: payload.deskripsi,
            status: STATUS_JADWAL.PENDING,
        });

        const result = (await this.jadwalRepository.createJadwal(createValues)) as JadwalJoinAttributes;

        result.truck = truck;
        result.driver = driver;

        return composeJadwal(result);
    };

    updateStatusJadwal = async (payload: PatchJadwal_Payload): Promise<JadwalResult> => {
        const { xid } = payload;
        if (!isValid(xid)) {
            throw errorResponses.getError("E_FOUND_1");
        }

        const jadwal = await this.jadwalRepository.findByXid(xid);

        if (!jadwal) {
            throw errorResponses.getError("E_FOUND_1");
        }

        const { status, version, userSession } = payload;

        if (jadwal.status === status) {
            throw errorResponses.getError("E_FOUND_1");
        }

        if (jadwal.version !== version) {
            throw errorResponses.getError("E_REQ_2");
        }

        const updateValues = updateData<JadwalAttributes>(
            jadwal,
            {
                status,
            },
            userSession
        );

        const result = await this.jadwalRepository.udpateJadwal(jadwal.id, updateValues, version);

        if (result === 0) {
            throw errorResponses.getError("E_REQ_2");
        }

        Object.assign(jadwal, updateValues);

        return composeJadwal(jadwal);
    };
}

export function composeJadwal(row: JadwalJoinAttributes): JadwalResult {
    return composeResult(row, {
        truck: composeTruck(row.truck!),
        driver: composeUsers(row.driver!),
        checkpoints: row.checkpoints ? row.checkpoints!.map((checkpoint) => composeCheckpoint(checkpoint)) : [],
        tanggal: toUnixEpoch(row.startDate),
        deskripsi: row.description,
        destination: row.destination,
        customer: row.customer,
        status: row.status,
    });
}
