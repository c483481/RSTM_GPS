import { isValid } from "ulidx";
import { AppRepositoryMap, UsersRepository } from "../../contract/repository.contract";
import { GetDetail_Payload, List_Payload, ListResult } from "../../module/dto.module";
import { compose, composeResult, createData } from "../../utils/helper.utils";
import { CreateUsers_Payload, UsersResult } from "../dto/users.dto";
import { UsersAttributes, UsersCreationAttributes } from "../model/users.model";
import { BaseService } from "./base.service";
import { errorResponses } from "../../response";
import { UsersService } from "../../contract/service.contract";
import { bcryptModule } from "../../module/bcrypt.module";

export class Users extends BaseService implements UsersService {
    private usersRepository!: UsersRepository;
    init(repository: AppRepositoryMap): void {
        this.usersRepository = repository.users;
    }

    getDetail = async (payload: GetDetail_Payload): Promise<UsersResult> => {
        const { xid } = payload;
        if (!isValid(xid)) {
            throw errorResponses.getError("E_FOUND_1");
        }

        const result = await this.usersRepository.findByXid(xid);

        if (!result) {
            throw errorResponses.getError("E_FOUND_1");
        }

        return composeUsers(result);
    };

    getList = async (payload: List_Payload): Promise<ListResult<UsersResult>> => {
        const result = await this.usersRepository.findList(payload);

        const items = compose(result.rows, composeUsers);

        return {
            items,
            count: result.count,
        };
    };

    createUsers = async (payload: CreateUsers_Payload): Promise<UsersResult> => {
        const { name, noHP, password, username, role } = payload;

        const newPassword = await bcryptModule.hash(password);

        const createdValues = createData<UsersCreationAttributes>({
            name,
            noHP,
            password: newPassword,
            username,
            role,
        });

        const result = await this.usersRepository.createUsers(createdValues);

        return composeUsers(result);
    };
}

export function composeUsers(row: UsersAttributes): UsersResult {
    return composeResult(row, {
        noHP: row.noHP,
        username: row.username,
        name: row.name,
        role: row.role,
    });
}
