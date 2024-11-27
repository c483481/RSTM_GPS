import { isValid } from "ulidx";
import { AppRepositoryMap, CheckpointRepository, JadwalRepository } from "../../contract/repository.contract";
import { CheckpointResult, CreateCheckpoint_Payload } from "../dto/checkpoint.dto";
import { CheckpointAttributes, CheckpointCreationAttributes } from "../model/checkpoint.model";
import { BaseService } from "./base.service";
import { errorResponses } from "../../response";
import { composeResult, createData, updateData } from "../../utils/helper.utils";
import { CheckpointService } from "../../contract/service.contract";
import { STATUS_JADWAL } from "../../constant/status-jadwal.constant";
import { PatchJadwal_Payload } from "../dto/jadwal.dto";

export class Checkpoint extends BaseService implements CheckpointService {
    private checkpointRepo!: CheckpointRepository;
    private jadwalRepo!: JadwalRepository;

    init(repository: AppRepositoryMap): void {
        this.checkpointRepo = repository.checkpoint;
        this.jadwalRepo = repository.jadwal;
    }

    createCheckpoint = async (data: CreateCheckpoint_Payload): Promise<CheckpointResult> => {
        const { name, jadwalXid, order } = data;

        if (!isValid(jadwalXid)) {
            throw errorResponses.getError("E_FOUND_1");
        }

        const jadwal = await this.jadwalRepo.findByXid(jadwalXid);

        if (!jadwal) {
            throw errorResponses.getError("E_FOUND_1");
        }

        const createdValues = createData<CheckpointCreationAttributes>({
            jadwalId: jadwal.id,
            checkpoint: name,
            order,
            status: STATUS_JADWAL.ONPROGRESS,
        });

        const result = await this.checkpointRepo.insertCheckpoint(createdValues);

        return composeCheckpoint(result);
    };

    updateStatusCheckpoint = async (payload: PatchJadwal_Payload): Promise<CheckpointResult> => {
        const { xid, status, version, userSession } = payload;

        if (!isValid(xid)) {
            throw errorResponses.getError("E_FOUND_1");
        }

        const checkpoint = await this.checkpointRepo.findByXid(xid);

        if (!checkpoint) {
            throw errorResponses.getError("E_FOUND_1");
        }

        if (checkpoint.status === status) {
            throw errorResponses.getError("E_FOUND_1");
        }

        if (checkpoint.version !== version) {
            throw errorResponses.getError("E_REQ_2");
        }

        const updateValues = updateData<CheckpointAttributes>(
            checkpoint,
            {
                status,
            },
            userSession
        );

        const result = await this.checkpointRepo.updateCheckpoint(checkpoint.id, updateValues, version);

        if (result === 0) {
            throw errorResponses.getError("E_REQ_2");
        }

        Object.assign(checkpoint, updateValues);

        return composeCheckpoint(checkpoint);
    };
}

export function composeCheckpoint(row: CheckpointAttributes): CheckpointResult {
    return composeResult(row, {
        name: row.checkpoint,
        order: row.order,
    });
}
