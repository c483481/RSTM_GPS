import { isValid } from "ulidx";
import { AppRepositoryMap, CheckpointRepository, JadwalRepository } from "../../contract/repository.contract";
import { CheckpointResult, CreateCheckpoint_Payload } from "../dto/checkpoint.dto";
import { CheckpointAttributes, CheckpointCreationAttributes } from "../model/checkpoint.model";
import { BaseService } from "./base.service";
import { errorResponses } from "../../response";
import { composeResult, createData } from "../../utils/helper.utils";
import { CheckpointService } from "../../contract/service.contract";

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
        });

        const result = await this.checkpointRepo.insertCheckpoint(createdValues);

        return composeCheckpoint(result);
    };
}

export function composeCheckpoint(row: CheckpointAttributes): CheckpointResult {
    return composeResult(row, {
        name: row.checkpoint,
        order: row.order,
    });
}
