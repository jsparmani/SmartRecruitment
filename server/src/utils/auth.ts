import {sign} from "jsonwebtoken";
import {User} from "../entity/User";

export const createAccessToken = (user: User) => {
    return sign(
        {userId: user.id, role: user.role},
        process.env.ACCESS_TOKEN_SECRET!,
        {expiresIn: "15m"}
    );
};

export const createRefreshToken = (user: User) => {
    return sign(
        {userId: user.id, role: user.role, tokenVersion: user.tokenVersion},
        process.env.REFRESH_TOKEN_SECRET!,
        {expiresIn: "7d"}
    );
};
