import { TYPE_STATUS_JADWAL } from "../../constant/status-jadwal.constant";
import { BaseResult, UserSession } from "../../module/dto.module";
import { TruckResult } from "./truck.dto";
import { UsersResult } from "./users.dto";

export type JadwalResult = BaseResult & {
    driver: UsersResult;
    truck: TruckResult;
    tanggal: number;
    customer: string;
    deskripsi: string | null;
    destination: string;
};

export type CreateJadwal_Payload = {
    truckXid: string;
    driverXid: string;
    tanggal: number;
    deskripsi: string | null;
    customer: string;
    destination: string;
};

export type PatchJadwal_Payload = {
    xid: string;
    status: TYPE_STATUS_JADWAL;
    version: number;
    userSession: UserSession;
};
