import { FindResult, List_Payload } from "../module/dto.module";
import { UpdateLocation_Payload } from "../server/dto/truck.dto";
import { CheckpointAttributes, CheckpointCreationAttributes } from "../server/model/checkpoint.model";
import { JadwalAttributes, JadwalCreationAttributes, JadwalJoinAttributes } from "../server/model/jadwal.model";
import { TruckAttributes, TruckCreationAttributes } from "../server/model/truck.model";
import { UsersCreationAttributes, UsersAttributes } from "../server/model/users.model";

export interface AppRepositoryMap {
    users: UsersRepository;
    truck: TruckRepository;
    jadwal: JadwalRepository;
    checkpoint: CheckpointRepository;
}

export interface UsersRepository {
    findByUsername(username: string): Promise<UsersAttributes | null>;

    findByXid(xid: string): Promise<UsersAttributes | null>;

    findUsersCount(): Promise<number>;

    createUsers(payload: UsersCreationAttributes): Promise<UsersAttributes>;

    findList(payload: List_Payload): Promise<FindResult<UsersAttributes>>;

    updateUsers(id: number, payload: Partial<UsersAttributes>, version: number): Promise<number>;
}

export interface TruckRepository {
    findByPlatNomor(platNomor: string): Promise<TruckAttributes | null>;

    findByXid(xid: string): Promise<TruckAttributes | null>;

    findTruckCount(): Promise<number>;

    findList(payload: List_Payload): Promise<FindResult<TruckAttributes>>;

    createTruck(payload: TruckCreationAttributes): Promise<TruckAttributes>;

    updateTruck(id: number, payload: Partial<TruckAttributes>, version: number): Promise<number>;

    updateLocation(payload: UpdateLocation_Payload): void;
}

export interface JadwalRepository {
    findByXid(xid: string): Promise<JadwalJoinAttributes | null>;

    createJadwal(data: JadwalCreationAttributes): Promise<JadwalJoinAttributes>;

    udpateJadwal(id: number, data: Partial<JadwalAttributes>, version: number): Promise<number>;

    deleteJadwal(id: number): Promise<number>;

    findList(payload: List_Payload): Promise<FindResult<JadwalJoinAttributes>>;
}

export interface CheckpointRepository {
    insertCheckpoint(data: CheckpointCreationAttributes): Promise<CheckpointAttributes>;

    findByXid(xid: string): Promise<CheckpointAttributes | null>;

    updateCheckpoint(id: number, payload: Partial<CheckpointAttributes>, version: number): Promise<number>;
}
