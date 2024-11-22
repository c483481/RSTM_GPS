import { STATUS_JADWAL } from "../../constant/status-jadwal.constant";
import { AppServiceMap, JadwalService } from "../../contract/service.contract";
import { WrapAppHandler } from "../../handler/default.handler";
import { getDetailOption, getListOption } from "../../utils/helper.utils";
import { middlewareRBAC } from "../../utils/middleware-helper.utils";
import { CreateJadwal_Payload, PatchJadwal_Payload } from "../dto/jadwal.dto";
import { validate } from "../validate";
import { JadwalValidator } from "../validate/jadwal.validator";
import { BaseController } from "./base.controller";
import { Request } from "express";

export class JadwalController extends BaseController {
    private service!: JadwalService;
    constructor() {
        super("jadwal");
    }

    init(service: AppServiceMap): void {
        this.service = service.jadwal;
    }

    initRoute(): void {
        this.router.post("/", middlewareRBAC(), WrapAppHandler(this.createJadwal));
        this.router.get("/:xid/detail", middlewareRBAC(), WrapAppHandler(this.getDetail));
        this.router.get("/", middlewareRBAC(), WrapAppHandler(this.getList));

        this.router.patch("/:xid/onprogress", middlewareRBAC(), WrapAppHandler(this.patchOnProgress));
        this.router.patch("/:xid/done", middlewareRBAC(), WrapAppHandler(this.patchDone));
        this.router.patch("/:xid/cancel", middlewareRBAC(), WrapAppHandler(this.patchCancel));
    }

    createJadwal = async (req: Request): Promise<unknown> => {
        const payload = req.body as CreateJadwal_Payload;

        validate(JadwalValidator.CreateJadwal_Payload, payload);

        const result = await this.service.createJadwal(payload);

        return result;
    };

    getDetail = async (req: Request): Promise<unknown> => {
        const payload = getDetailOption(req);

        const result = await this.service.getDetail(payload);

        return result;
    };

    getList = async (req: Request): Promise<unknown> => {
        const payload = getListOption(req);

        const result = await this.service.getList(payload);

        return result;
    };

    patchOnProgress = async (req: Request): Promise<unknown> => {
        const payload = req.body as PatchJadwal_Payload;

        payload.status = STATUS_JADWAL.ONPROGRESS;

        validate(JadwalValidator.PatchJadwal_Payload, payload);

        payload.xid = req.params.xid;

        const result = await this.service.updateStatusJadwal(payload);

        return result;
    };

    patchDone = async (req: Request): Promise<unknown> => {
        const payload = req.body as PatchJadwal_Payload;

        payload.status = STATUS_JADWAL.DONE;

        validate(JadwalValidator.PatchJadwal_Payload, payload);

        payload.xid = req.params.xid;

        const result = await this.service.updateStatusJadwal(payload);

        return result;
    };

    patchCancel = async (req: Request): Promise<unknown> => {
        const payload = req.body as PatchJadwal_Payload;

        payload.status = STATUS_JADWAL.CANCEL;

        validate(JadwalValidator.PatchJadwal_Payload, payload);

        payload.xid = req.params.xid;

        const result = await this.service.updateStatusJadwal(payload);

        return result;
    };
}
