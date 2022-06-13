
import { Request, Response, NextFunction } from 'express';
import {isAdmin} from "../utils/utils";
import { AuthRequest } from "./AuthRequest";

// 需搭配jwtAuth
export default function isAdminMiddleware(req: AuthRequest, res: Response, next: NextFunction) {

    if ( isAdmin(req.authUserID as number) ) {
        return next();
    } else {
        next(new Error("You are not admin"))
    }
};

