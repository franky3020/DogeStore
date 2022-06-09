
import { Request, Response, NextFunction } from 'express';


const ADMIN_ID = 1;

// 需搭配jwtAuth
export default function isAdmin(req: any, res: Response, next: NextFunction) {

    if (req.authUserID === ADMIN_ID) {
        return next();
    } else {
        next(new Error("you are not admin"))
    }

};