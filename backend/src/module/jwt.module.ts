import { config } from "../config";
import { sign, verify } from "jsonwebtoken";
import { EncodeRefreshToken, EncodeToken, JwtResult, UserAuthToken } from "./dto.module";

class JwtModule {
    private readonly jwtKey = config.jwtKey;
    private readonly jwtRefreshKey = config.jwtRefreshKey;

    issue = (data: UserAuthToken): JwtResult => {
        const token = sign({ data: { xid: data.xid, email: data.username } }, this.jwtKey);

        return token;
    };

    issueRefresh = (xid: string): JwtResult => {
        const token = sign({ data: { xid } }, this.jwtRefreshKey);

        return token;
    };

    issueWithAudience = (data: UserAuthToken, audience: string): JwtResult => {
        const token = sign({ data: { xid: data.xid, email: data.username } }, this.jwtKey, {
            audience: audience,
        });

        return token;
    };

    verifyWithAudience = (token: string, audience: string[]): EncodeToken => {
        return verify(token, this.jwtKey, {
            audience: audience,
        }) as EncodeToken;
    };

    verify = (token: string): EncodeToken => {
        return verify(token, this.jwtKey) as EncodeToken;
    };

    verifyRefreshToken = (token: string): EncodeRefreshToken => {
        return verify(token, this.jwtRefreshKey) as EncodeRefreshToken;
    };
}

export const jwtModule = new JwtModule();
