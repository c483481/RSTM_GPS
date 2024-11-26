import { AppServiceMap, UsersService } from "../../contract/service.contract";
import { WrapAppHandler } from "../../handler/default.handler";
import { getDetailOption, getForceUsersSession, getListOption } from "../../utils/helper.utils";
import { defaultMiddleware } from "../../utils/middleware-helper.utils";
import { CreateUsers_Payload, UpdateUsers_Payload } from "../dto/users.dto";
import { BaseController } from "./base.controller";
import { Request } from "express";
import { UsersValidator } from "../validate/users.validator";
import { validate } from "../validate";
import { ROLE } from "../../constant/role.constant";
import { GetDetail_Payload } from "../../module/dto.module";

export class UsersController extends BaseController {
    private service!: UsersService;

    constructor() {
        super("users");
    }

    init(service: AppServiceMap): void {
        this.service = service.users;
    }

    initRoute(): void {
        this.router.get("/:xid/detail", defaultMiddleware(), WrapAppHandler(this.getDetail));
        this.router.get("/profile", defaultMiddleware(), WrapAppHandler(this.getOwnProfile));
        this.router.get("/", defaultMiddleware(), WrapAppHandler(this.getList));
        this.router.post("/", defaultMiddleware([ROLE.ADMIN]), WrapAppHandler(this.createUsers));
        this.router.put("/own", defaultMiddleware(), WrapAppHandler(this.updateProfile));
    }

    getDetail = async (req: Request): Promise<unknown> => {
        const payload = getDetailOption(req);

        const result = await this.service.getDetail(payload);

        return result;
    };

    getOwnProfile = async (req: Request): Promise<unknown> => {
        const userSession = getForceUsersSession(req);
        const payload: GetDetail_Payload = {
            xid: userSession.xid,
            usersSession: userSession,
        };

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

    updateProfile = async (req: Request): Promise<unknown> => {
        const payload = req.body as UpdateUsers_Payload;

        validate(UsersValidator.UpdateUsers_Payload, payload);

        payload.usersession = getForceUsersSession(req);

        const result = await this.service.updateUsers(payload);

        return result;
    };
}
