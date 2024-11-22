import { FindResult, List_Payload } from "../module/dto.module";
import { JadwalAttributes, JadwalCreationAttributes, JadwalJoinAttributes } from "../server/model/jadwal.model";
import { TruckAttributes, TruckCreationAttributes } from "../server/model/truck.model";
import { UsersCreationAttributes, UsersAttributes } from "../server/model/users.model";

export interface AppRepositoryMap {
    users: UsersRepository;
    truck: TruckRepository;
    jadwal: JadwalRepository;
}

export interface UsersRepository {
    findByUsername(username: string): Promise<UsersAttributes | null>;

    findByXid(xid: string): Promise<UsersAttributes | null>;

    findUsersCount(): Promise<number>;

    createUsers(payload: UsersCreationAttributes): Promise<UsersAttributes>;

    findList(payload: List_Payload): Promise<FindResult<UsersAttributes>>;
}

export interface TruckRepository {
    findByPlatNomor(platNomor: string): Promise<TruckAttributes | null>;

    findByXid(xid: string): Promise<TruckAttributes | null>;

    findTruckCount(): Promise<number>;

    findList(payload: List_Payload): Promise<FindResult<TruckAttributes>>;

    createTruck(payload: TruckCreationAttributes): Promise<TruckAttributes>;

    updateTruck(id: number, payload: Partial<TruckAttributes>, version: number): Promise<number>;
}

export interface JadwalRepository {
    findByXid(xid: string): Promise<JadwalJoinAttributes | null>;

    createJadwal(data: JadwalCreationAttributes): Promise<JadwalJoinAttributes>;

    udpateJadwal(id: number, data: Partial<JadwalAttributes>, version: number): Promise<number>;

    deleteJadwal(id: number): Promise<number>;

    findList(payload: List_Payload): Promise<FindResult<JadwalJoinAttributes>>;
}
