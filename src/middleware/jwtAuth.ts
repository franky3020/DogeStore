var jwt = require('jsonwebtoken');
import { Response, NextFunction } from 'express';
import {AuthRequest} from "./AuthRequest";
import 'dotenv/config';


// Add userId in req.authUserID
export function authentication(req: AuthRequest, res: Response, next: NextFunction) {


    let token = '';
    try {

        if(typeof req.headers['authorization'] !== "undefined") {

            if(typeof req.headers['authorization'].split(' ')[1] !== "undefined") {
                token = req.headers['authorization'].split(' ')[1];
            } else {
                throw Error("req.headers['authorization'].split(' ')[1] is undefined");
            }
            
        }

    } catch (err) {
        return next(err);
    }
    
    jwt.verify(token, process.env.JWT_PRIVATE_KEY, function (err: any, decoded: any) {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized!' });
        } else {

            if(typeof decoded.id === "number") {
                req.authUserID =  decoded.id;
                return next();
            }
            return next(new Error("decoded.id not number"));
        }
    });
};

