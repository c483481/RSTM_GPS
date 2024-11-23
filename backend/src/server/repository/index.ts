import {
    AppRepositoryMap,
    CheckpointRepository,
    JadwalRepository,
    TruckRepository,
    UsersRepository,
} from "../../contract/repository.contract";
import { AppDataSource } from "../../module/datasource.module";
import { BaseRepository } from "./base.repository";
import { SequelizeCheckpointRepository } from "./checkpoint.repository";
import { SequelizeJadwalRepository } from "./jadwal.repository";
import { SequelizeTruckRepository } from "./truck.reposiotry";
import { SequelizeUsersRepository } from "./users.repository";

export class Repository implements AppRepositoryMap {
    readonly users: UsersRepository = new SequelizeUsersRepository();
    readonly truck: TruckRepository = new SequelizeTruckRepository();
    readonly jadwal: JadwalRepository = new SequelizeJadwalRepository();
    readonly checkpoint: CheckpointRepository = new SequelizeCheckpointRepository();

    init(datasource: AppDataSource) {
        Object.entries(this).forEach(([k, r]) => {
            if (r instanceof BaseRepository) {
                r.init(datasource);
                console.log(`initiate repository ${k}`);
            }
        });
    }
}
