import { ROLE } from "../../constant/role.constant";
import { AppServiceMap, CheckpointService } from "../../contract/service.contract";
import { WrapAppHandler } from "../../handler/default.handler";
import { middlewareRBAC } from "../../utils/middleware-helper.utils";
import { CreateCheckpoint_Payload } from "../dto/checkpoint.dto";
import { validate } from "../validate";
import { CheckpointValidator } from "../validate/checkpoint.validator";
import { BaseController } from "./base.controller";
import { Request } from "express";

export class CheckpointController extends BaseController {
    private service!: CheckpointService;

    constructor() {
        super("checkpoint");
    }

    init(service: AppServiceMap): void {
        this.service = service.checkpoint;
    }

    initRoute(): void {
        this.router.post("/", middlewareRBAC([ROLE.ADMIN, ROLE.SALES]), WrapAppHandler(this.createCheckpoint));
    }

    createCheckpoint = async (req: Request): Promise<unknown> => {
        const payload = req.body as CreateCheckpoint_Payload;

        validate(CheckpointValidator.CreateCheckpoint_Payload, payload);

        const result = await this.service.createCheckpoint(payload);

        return result;
    };
}
