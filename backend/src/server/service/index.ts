import { AppRepositoryMap } from "../../contract/repository.contract";
import { AppServiceMap, AuthService } from "../../contract/service.contract";
import { Auth } from "./auth.service";
import { BaseService } from "./base.service";

export class Service implements AppServiceMap {
    readonly auth: AuthService = new Auth();
    init(repository: AppRepositoryMap) {
        Object.entries(this).forEach(([k, r]) => {
            if (r instanceof BaseService) {
                r.init(repository);
                console.log(`initiate service ${k}`);
            }
        });
    }
}
