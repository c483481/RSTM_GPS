import { AppServiceMap, TruckService } from "../../contract/service.contract";
import { getDetailOption, getForceUsersSession, getListOption } from "../../utils/helper.utils";
import { BaseController } from "./base.controller";
import { Request } from "express";
import { TruckValidator } from "../validate/truck.validator";
import { validate } from "../validate";
import { CreateTruck_Payload, UpdateTruck_Payload } from "../dto/truck.dto";
import { WrapAppHandler } from "../../handler/default.handler";
import { defaultMiddleware, middlewareRBAC } from "../../utils/middleware-helper.utils";
import { ROLE } from "../../constant/role.constant";

export class TruckController extends BaseController {
    private service!: TruckService;

    constructor() {
        super("truck");
    }

    init(service: AppServiceMap): void {
        this.service = service.truck;
    }

    initRoute(): void {
        this.router.get("/:xid/detail", defaultMiddleware(), WrapAppHandler(this.getDetail));
        this.router.get("/", defaultMiddleware(), WrapAppHandler(this.getList));
        this.router.post("/", defaultMiddleware([ROLE.ADMIN]), WrapAppHandler(this.createTruck));
        this.router.put("/:xid", defaultMiddleware([ROLE.ADMIN, ROLE.DRIVER]), WrapAppHandler(this.updateTruck));
    }

    getDetail = async (req: Request) => {
        const payload = getDetailOption(req);

        const result = await this.service.getDetail(payload);

        return result;
    };

    getList = async (req: Request) => {
        const payload = getListOption(req);

        const result = await this.service.getList(payload);

        return result;
    };

    createTruck = async (req: Request) => {
        const payload = req.body as CreateTruck_Payload;

        validate(TruckValidator.CreateTruck_Payload, payload);

        payload.userSession = getForceUsersSession(req);

        const result = await this.service.createTruck(payload);

        return result;
    };

    updateTruck = async (req: Request) => {
        const payload = req.body as UpdateTruck_Payload;

        validate(TruckValidator.UpdateTruck_Payload, payload);

        payload.xid = req.params.xid;
        payload.userSession = getForceUsersSession(req);

        const result = await this.service.updateTruck(payload);

        return result;
    };
}
