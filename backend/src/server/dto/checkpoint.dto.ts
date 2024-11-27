import { TYPE_STATUS_JADWAL } from "../../constant/status-jadwal.constant";
import { BaseResult } from "../../module/dto.module";

export interface CreateCheckpoint_Payload {
    jadwalXid: string;
    name: string;
    order: number;
}

export interface CheckpointResult extends BaseResult {
    name: string;
    order: number;
    status: TYPE_STATUS_JADWAL;
}
