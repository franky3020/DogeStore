
import { Request, Response, NextFunction } from 'express';
import {isAdmin} from "../utils/utils";

// 需搭配jwtAuth
export default function isAdminMiddleware(req: any, res: Response, next: NextFunction) {

    if ( isAdmin(req.authUserID) ) {
        return next();
    } else {
        next(new Error("you are not admin"))
    }
    // if (req.authUserID === ADMIN_ID) {
    //     return next();
    // } else {
    //     next(new Error("you are not admin"))
    // }

};

