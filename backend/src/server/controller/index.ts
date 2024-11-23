import { Router } from "express";
import { AppServiceMap } from "../../contract/service.contract";
import { BaseController } from "./base.controller";
import { AuthController } from "./auth.controller";
import { TruckController } from "./truck.controller";
import { JadwalController } from "./jadwal.controller";
import { UsersController } from "./users.controller";
import { CheckpointController } from "./checkpoint.controller";

export class Controller {
    private readonly auth: BaseController = new AuthController();
    private readonly truck: BaseController = new TruckController();
    private readonly jadwal: BaseController = new JadwalController();
    private readonly users: BaseController = new UsersController();
    private readonly checkpoint: BaseController = new CheckpointController();

    init(service: AppServiceMap): Router {
        const router = Router();
        Object.entries(this).forEach(([k, r]) => {
            if (r instanceof BaseController) {
                r.init(service);
                r.initRoute();
                const prefix = `/${r.getPrefix()}`;
                router.use(prefix, r.getRouter());

                console.log(`initiate ${k} route`);
            }
        });

        return router;
    }
}
