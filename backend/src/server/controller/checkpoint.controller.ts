import { Request } from "express";
import { ROLE } from "../../constant/role.constant";
import { STATUS_JADWAL } from "../../constant/status-jadwal.constant";
import { AppServiceMap, CheckpointService } from "../../contract/service.contract";
import { WrapAppHandler } from "../../handler/default.handler";
import { defaultMiddleware } from "../../utils/middleware-helper.utils";
import { CreateCheckpoint_Payload } from "../dto/checkpoint.dto";
import { PatchJadwal_Payload } from "../dto/jadwal.dto";
import { validate } from "../validate";
import { CheckpointValidator } from "../validate/checkpoint.validator";
import { BaseController } from "./base.controller";

export class CheckpointController extends BaseController {
    private service!: CheckpointService;

    constructor() {
        super("checkpoint");
    }

    init(service: AppServiceMap): void {
        this.service = service.checkpoint;
    }

    initRoute(): void {
        this.router.post("/", defaultMiddleware([ROLE.ADMIN, ROLE.SALES]), WrapAppHandler(this.createCheckpoint));

        this.router.patch("/:xid/onprogress", defaultMiddleware(), WrapAppHandler(this.patchOnProgress));
        this.router.patch("/:xid/done", defaultMiddleware(), WrapAppHandler(this.patchDone));
        this.router.patch("/:xid/cancel", defaultMiddleware(), WrapAppHandler(this.patchCancel));
    }

    createCheckpoint = async (req: Request): Promise<unknown> => {
        const payload = req.body as CreateCheckpoint_Payload;

        validate(CheckpointValidator.CreateCheckpoint_Payload, payload);

        const result = await this.service.createCheckpoint(payload);

        return result;
    };

    patchOnProgress = async (req: Request): Promise<unknown> => {
        const payload = req.body as PatchJadwal_Payload;

        payload.status = STATUS_JADWAL.ONPROGRESS;

        validate(CheckpointValidator.PatchCheckpoint_Payload, payload);

        payload.xid = req.params.xid;

        const result = await this.service.updateStatusCheckpoint(payload);

        return result;
    };

    patchDone = async (req: Request): Promise<unknown> => {
        const payload = req.body as PatchJadwal_Payload;

        payload.status = STATUS_JADWAL.DONE;

        validate(CheckpointValidator.PatchCheckpoint_Payload, payload);

        payload.xid = req.params.xid;

        const result = await this.service.updateStatusCheckpoint(payload);

        return result;
    };

    patchCancel = async (req: Request): Promise<unknown> => {
        const payload = req.body as PatchJadwal_Payload;

        payload.status = STATUS_JADWAL.CANCEL;

        validate(CheckpointValidator.PatchCheckpoint_Payload, payload);

        payload.xid = req.params.xid;

        const result = await this.service.updateStatusCheckpoint(payload);

        return result;
    };
}
