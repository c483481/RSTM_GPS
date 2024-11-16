import { Request } from "express";
import { AppServiceMap, AuthService } from "../../contract/service.contract";
import { BaseController } from "./base.controller";
import { AuthLogin_Payload } from "../dto/auth.dto";
import { validate } from "../validate";
import { AuthValidator } from "../validate/auth.validator";
import { WrapAppHandler } from "../../handler/default.handler";

export class AuthController extends BaseController {
    private service!: AuthService;
    constructor() {
        super("auth");
    }

    init(service: AppServiceMap): void {
        this.service = service.auth;
    }

    initRoute(): void {
        this.router.post("/", WrapAppHandler(this.postLogin));
    }

    postLogin = async (req: Request): Promise<unknown> => {
        const payload = req.body as AuthLogin_Payload;

        validate(AuthValidator.AuthLogin_Payload, payload);

        const result = await this.service.login(payload);

        return result;
    };
}
