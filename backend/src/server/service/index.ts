import { AppRepositoryMap } from "../../contract/repository.contract";
import {
    AppServiceMap,
    AuthService,
    CheckpointService,
    JadwalService,
    TruckService,
    UsersService,
} from "../../contract/service.contract";
import { Auth } from "./auth.service";
import { BaseService } from "./base.service";
import { Checkpoint } from "./checkpoint.service";
import { Jadwal } from "./jadwal.service";
import { Truck } from "./truck.service";
import { Users } from "./users.service";

export class Service implements AppServiceMap {
    readonly auth: AuthService = new Auth();
    readonly users: UsersService = new Users();
    readonly truck: TruckService = new Truck();
    readonly jadwal: JadwalService = new Jadwal();
    readonly checkpoint: CheckpointService = new Checkpoint();

    init(repository: AppRepositoryMap) {
        Object.entries(this).forEach(([k, r]) => {
            if (r instanceof BaseService) {
                r.init(repository);
                console.log(`initiate service ${k}`);
            }
        });
    }
}
