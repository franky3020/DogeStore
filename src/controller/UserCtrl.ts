import { Request, Response, NextFunction } from 'express';

import UserService from "../service/UserService";

export default class UserCtrl {


    async getUserJWT(req: Request, res: Response, next: NextFunction) {
        let userService = UserService.getInstance();

        let email = req.body.email;
        let password = req.body.password;

        try {
            let jwt = await userService.getUserJWT(email, password);
            if(jwt) {
                res.send(jwt);
            } else {
                res.status(401).end(); 
            }

        } catch (err) {
            next(err);
        }
        
    }
    
}