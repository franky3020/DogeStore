import { Response, NextFunction } from 'express';
import { AuthRequest } from "./AuthRequest";
import 'dotenv/config';
import JWTService from "../service/JWTService";


// Add userId in req.authUserID
export async function authentication(req: AuthRequest, res: Response, next: NextFunction) {

    if (typeof req.headers['authorization'] === "undefined") {
        return next(new Error("Not have authorization header"));
    }

    let token = req.headers['authorization'].split(' ')[1];
    if (typeof token === "undefined") {
        return next(new Error("req.headers['authorization'].split(' ')[1] is undefined"));
    }
   

    let user_id = await JWTService.decodedUserJWT2UserId(token);
    if(user_id === null) {
        return res.status(401).json({ message: 'Unauthorized!' });
    } else {
        req.authUserID = user_id;
        return next();
    }

};

