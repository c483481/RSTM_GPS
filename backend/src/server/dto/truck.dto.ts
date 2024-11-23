import { TYPE_STATUS } from "../../constant/status.constant";
import { BaseResult, UserAuthToken } from "../../module/dto.module";

export type CreateTruck_Payload = {
    nama: string;
    platNomor: string;
    userSession: UserAuthToken;
};

export type UpdateTruck_Payload = {
    xid: string;
    status: TYPE_STATUS;
    estimasiDone: number | null;
    deskripsi: string;
    version: number;
    userSession: UserAuthToken;
};

export type TruckResult = BaseResult & {
    nama: string;
    platNomor: string;
    deskripsi: string;
    status: TYPE_STATUS;
    estimasiDone: number | null;
};

export type UpdateLocation_Payload = {
    xid: string;
    latitude: number;
    longitude: number;
    battery: number;
};
