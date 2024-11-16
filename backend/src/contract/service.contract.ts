import { AuthLogin_Payload, AuthLogin_Result } from "../server/dto/auth.dto";

export interface AppServiceMap {
    auth: AuthService;
}

export interface AuthService {
    login(payload: AuthLogin_Payload): Promise<AuthLogin_Result>;
}
