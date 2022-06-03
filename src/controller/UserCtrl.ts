import { Request, Response, NextFunction } from 'express';

import UserService from "../service/UserService";

export default class UserCtrl {


    async getUserJWT(req: Request, res: Response, next: NextFunction) {
        let userService = UserService.getInstance();

        let email = req.body.email;
        let password = req.body.password;

        try {
            // 這裡為了讓商業邏輯封裝在 service中 所以不能是先做判斷 在拿去JWT, 現在這樣才是對的
            let jwt = await userService.getUserJWT(email, password);

            if(jwt) {

                let jwt_json = {"token": jwt};
                res.send(jwt_json);

            } else {
                res.status(401).end(); 
            }

        } catch (err) {
            next(err);
        }
        
    }
    
}