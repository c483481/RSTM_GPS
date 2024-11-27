import { UploadedFile } from "express-fileupload";
import { TYPE_STATUS } from "../../constant/status.constant";
import { BaseResult, UserAuthToken } from "../../module/dto.module";

export type CreateTruck_Payload = {
    nama: string;
    platNomor: string;
    userSession: UserAuthToken;
    truckImg: UploadedFile;
};

export type UpdateTruck_Payload = {
    xid: string;
    status: TYPE_STATUS;
    estimasiDone: number | null;
    deskripsi: string;
    version: number;
    userSession: UserAuthToken;
    maintananceImg: UploadedFile | null;
};

export type TruckResult = BaseResult & {
    nama: string;
    platNomor: string;
    deskripsi: string;
    status: TYPE_STATUS;
    estimasiDone: number | null;
    truckImg: string;
    maintanaceImg: string | null;
};

export type UpdateLocation_Payload = {
    xid: string;
    latitude: number;
    longitude: number;
    battery: number;
};
