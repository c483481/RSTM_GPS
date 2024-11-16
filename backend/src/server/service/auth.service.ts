import { ROLE } from "../../constant/role.constant";
import { AppRepositoryMap, UsersRepository } from "../../contract/repository.contract";
import { AuthService } from "../../contract/service.contract";
import { bcryptModule } from "../../module/bcrypt.module";
import { jwtModule } from "../../module/jwt.module";
import { errorResponses } from "../../response";
import { AuthLogin_Payload, AuthLogin_Result } from "../dto/auth.dto";
import { BaseService } from "./base.service";
import { composeUsers } from "./users.service";

export class Auth extends BaseService implements AuthService {
    private usersRepo!: UsersRepository;

    init(repository: AppRepositoryMap): void {
        this.usersRepo = repository.users;
    }

    login = async (payload: AuthLogin_Payload): Promise<AuthLogin_Result> => {
        const { username, password } = payload;

        const users = await this.usersRepo.findByUsername(username);

        if (!users) {
            throw errorResponses.getError("E_AUTH_2");
        }

        const verify = await bcryptModule.compare(password, users.password);

        if (!verify) {
            throw errorResponses.getError("E_AUTH_2");
        }

        let token!: string;

        if (users.role === ROLE.ADMIN || users.role === ROLE.SALES) {
            token = jwtModule.issueWithAudience(
                {
                    xid: users.xid,
                    username: users.username,
                    auth: {
                        role: "admin",
                    },
                },
                users.role
            );
        } else if (users.role === ROLE.DRIVER) {
            token = jwtModule.issueWithAudience(
                {
                    xid: users.xid,
                    username: users.username,
                    auth: {
                        role: "driver",
                        noHP: users.noHP,
                    },
                },
                users.role
            );
        }

        const result = composeUsers(users) as AuthLogin_Result;

        result.token = token;

        return result;
    };
}
