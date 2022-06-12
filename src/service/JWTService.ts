

import User from "../entity/User";
const jwt = require("jsonwebtoken");
import 'dotenv/config';


export default class JWTService {

    static signUserJWT(user: User) {

        let id = user.id;
        let email = user.email;
        let nickname = user.nickname;

        const token = jwt.sign({ id, email, nickname }, process.env.JWT_PRIVATE_KEY);
        return token;
    }

    static decodedUserJWT2UserId(token: string): Promise<number | null> { // if verification failed return null 

        return new Promise((resolve) => {

            jwt.verify(token, process.env.JWT_PRIVATE_KEY, function (err: any, decoded: any) {

                if (err) {
                    return resolve(null);
                } else {
                    return resolve(decoded.id);
                }

            });
        });
    }

}