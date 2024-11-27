import { Request } from "express";
import { ROLE } from "../../constant/role.constant";
import { AppServiceMap, TruckService } from "../../contract/service.contract";
import { WrapAppHandler } from "../../handler/default.handler";
import { getDetailOption, getForceUsersSession, getListOption } from "../../utils/helper.utils";
import { defaultMiddleware } from "../../utils/middleware-helper.utils";
import { CreateTruck_Payload, UpdateLocation_Payload, UpdateTruck_Payload } from "../dto/truck.dto";
import { validate } from "../validate";
import { TruckValidator } from "../validate/truck.validator";
import { BaseController } from "./base.controller";
import { errorResponses } from "../../response";

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
        this.router.post("/:xid/location", WrapAppHandler(this.updateLocation));
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

        const files = req.files;

        const img = TruckValidator.isValidImage(files);

        if (!img) {
            throw errorResponses.getError("E_FOUND_1");
        }

        payload.truckImg = img;

        const result = await this.service.createTruck(payload);

        return result;
    };

    updateTruck = async (req: Request) => {
        const payload = req.body as UpdateTruck_Payload;

        validate(TruckValidator.UpdateTruck_Payload, payload);

        const files = req.files;

        payload.xid = req.params.xid;
        payload.userSession = getForceUsersSession(req);
        payload.maintananceImg = TruckValidator.isValidImage(files);

        const result = await this.service.updateTruck(payload);

        return result;
    };

    updateLocation = async (req: Request) => {
        const payload = req.body as UpdateLocation_Payload;

        payload.xid = req.params.xid;

        validate(TruckValidator.UpdateLocation_Payload, payload);

        await this.service.updateLocation(payload);

        return "success";
    };
}
