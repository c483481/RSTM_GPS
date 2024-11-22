import { AppServiceMap, UsersService } from "../../contract/service.contract";
import { WrapAppHandler } from "../../handler/default.handler";
import { getDetailOption, getListOption } from "../../utils/helper.utils";
import { middlewareRBAC } from "../../utils/middleware-helper.utils";
import { CreateUsers_Payload } from "../dto/users.dto";
import { BaseController } from "./base.controller";
import { Request } from "express";
import { UsersValidator } from "../validate/users.validator";
import { validate } from "../validate";
import { ROLE } from "../../constant/role.constant";

export class UsersController extends BaseController {
    private service!: UsersService;

    constructor() {
        super("users");
    }

    init(service: AppServiceMap): void {
        this.service = service.users;
    }

    initRoute(): void {
        this.router.get("/:xid/detail", middlewareRBAC(), WrapAppHandler(this.getDetail));
        this.router.get("/", middlewareRBAC(), WrapAppHandler(this.getList));
        this.router.post("/", middlewareRBAC([ROLE.ADMIN]), WrapAppHandler(this.createUsers));
    }

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

    createUsers = async (req: Request): Promise<unknown> => {
        const payload = req.body as CreateUsers_Payload;

        validate(UsersValidator.CreateUsers_Payload, payload);

        const result = await this.service.createUsers(payload);

        return result;
    };
}
