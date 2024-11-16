import { Router } from "express";
import { AppServiceMap } from "../../contract/service.contract";

export abstract class BaseController {
    protected router: Router;
    private readonly prefix: string;

    constructor(prefix: string) {
        this.prefix = prefix;
        this.router = Router();
    }

    abstract init(service: AppServiceMap): void;

    abstract initRoute(): void;

    getPrefix = (): string => {
        return this.prefix;
    };

    getRouter = (): Router => {
        return this.router;
    };
}
