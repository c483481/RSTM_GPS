import { ROLE } from "../../constant/role.constant";
import { baseValidator } from "./base.validator";

export class UsersValidator {
    static CreateUsers_Payload = baseValidator.compile({
        noHP: "string|empty:false|required",
        name: "string|empty:false|required|min:5|max:255",
        username: "string|empty:false|required|min:5|max:255",
        password: "string|empty:false|required",
        role: {
            type: "enum",
            values: [ROLE.ADMIN, ROLE.DRIVER, ROLE.SALES],
        },
        $$strict: true,
    });

    static UpdateUsers_Payload = baseValidator.compile({
        name: "string|empty:false|required|min:5|max:255",
        password: "string|empty:false|required",
        version: "number|empty:false|required|min:1",
        $$strict: true,
    });
}
