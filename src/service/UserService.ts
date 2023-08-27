import UserDAO from "../repositories/UserDAO";
import User from "../entity/User";
import JWTService from "./JWTService";
import 'dotenv/config';
const bcrypt = require('bcrypt');

export default class UserService {

    private userDAO: UserDAO;

    static readonly PASSWORD_SALT_ROUNDS = 10;

    constructor(userDAO: UserDAO) {
        this.userDAO = userDAO;
    }

    // if not exist that user, return null
    async getUserJWT(email: string, password: string): Promise<string | null> {

        let isLogin = await this.checkUserPassword(email, password);

        if (isLogin) {
            let user: User = await this.userDAO.findByEmail(email) as User;

            let jwt = JWTService.signUserJWT(user, process.env.JWT_PRIVATE_KEY as string);
            return jwt;

        }
        return null;

    }

    async checkUserPassword(email: string, password: string): Promise<boolean> {

        let user: User | null = await this.userDAO.findByEmail(email);

        if (user) {
            let isUserLogin = await this.bcryptComparePassword(password, user.password);
            return isUserLogin;
        }
        return false;

    }

    async addNewUser(email: string, nickname: string, password: string, id?: number) {

        let isUserExist = await this.checkUserEmailExist(email);
        if (isUserExist) {
            throw Error("User is exist");
        }

        let hashPassword = await this.bcryptPassword(password);

        if (typeof id === "undefined") {
            let user = new User(null, email, nickname, hashPassword);
            await this.userDAO.create(user);
        } else {
            let user = new User(id, email, nickname, hashPassword);
            await this.userDAO.create(user);
        }
    }


    bcryptPassword(password: string): Promise<string> {
        return bcrypt.hash(password, UserService.PASSWORD_SALT_ROUNDS);
    }

    bcryptComparePassword(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }

    async checkUserEmailExist(email: string): Promise<boolean> {

        let user: User | null = await this.userDAO.findByEmail(email);

        if (user) {
            return true;
        }
        return false;

    }

    async checkUserExistById(id: number): Promise<boolean> {

        let user: User | null = await this.userDAO.findById(id);

        if (user) {
            return true;
        }
        return false;

    }

    async getUserNameById(id: number): Promise<string|null> {
        let user: User | null = await this.userDAO.findById(id);

        if (user) {
            return user.nickname;
        }
        return null;
    }
}
