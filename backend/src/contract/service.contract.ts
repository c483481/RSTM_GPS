import { GetDetail_Payload, List_Payload, ListResult } from "../module/dto.module";
import { AuthLogin_Payload, AuthLogin_Result } from "../server/dto/auth.dto";
import { CheckpointResult, CreateCheckpoint_Payload } from "../server/dto/checkpoint.dto";
import { CreateJadwal_Payload, JadwalResult, PatchJadwal_Payload } from "../server/dto/jadwal.dto";
import { CreateTruck_Payload, TruckResult, UpdateLocation_Payload, UpdateTruck_Payload } from "../server/dto/truck.dto";
import { CreateUsers_Payload, UpdateUsers_Payload, UsersResult } from "../server/dto/users.dto";

export interface AppServiceMap {
    auth: AuthService;
    users: UsersService;
    truck: TruckService;
    jadwal: JadwalService;
    checkpoint: CheckpointService;
}

export interface AuthService {
    login(payload: AuthLogin_Payload): Promise<AuthLogin_Result>;
}

export interface TruckService {
    createTruck(payload: CreateTruck_Payload): Promise<TruckResult>;

    getDetail(payload: GetDetail_Payload): Promise<TruckResult>;

    getList(payload: List_Payload): Promise<ListResult<TruckResult>>;

    updateTruck(payload: UpdateTruck_Payload): Promise<TruckResult>;

    updateLocation(payload: UpdateLocation_Payload): Promise<void>;
}

export interface JadwalService {
    createJadwal(payload: CreateJadwal_Payload): Promise<JadwalResult>;

    getDetail(payload: GetDetail_Payload): Promise<JadwalResult>;

    getList(payload: List_Payload): Promise<ListResult<JadwalResult>>;

    updateStatusJadwal(payload: PatchJadwal_Payload): Promise<JadwalResult>;
}

export interface UsersService {
    getDetail(payload: GetDetail_Payload): Promise<UsersResult>;

    getList(payload: List_Payload): Promise<ListResult<UsersResult>>;

    createUsers(payload: CreateUsers_Payload): Promise<UsersResult>;

    updateUsers(payload: UpdateUsers_Payload): Promise<UsersResult>;
}

export interface CheckpointService {
    createCheckpoint(data: CreateCheckpoint_Payload): Promise<CheckpointResult>;

    updateStatusCheckpoint(payload: PatchJadwal_Payload): Promise<CheckpointResult>;
}
