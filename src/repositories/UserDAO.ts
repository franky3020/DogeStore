
import mysql from "mysql2";
import User from "../entity/User";

export default class UserDAO {

    connection: mysql.Pool;

    constructor(connection: mysql.Pool) {
        this.connection = connection;
    }

    create(user: User): Promise<any> {
        let connection = this.connection;

        if( user.id !== null ) {

            let sql = "INSERT INTO `User`(`id`,`email`,`nickname`,`password`)VALUES(?,?,?,?)";
            return connection.promise().query(sql, [user.id, user.email, user.nickname, user.password]);

        } else {

            let sql = "INSERT INTO `User`(`email`,`nickname`,`password`)VALUES(?,?,?)";
            return connection.promise().query(sql, [user.email, user.nickname, user.password]);
        }
        
    }

    update(user: User): Promise<any> {
        
        let connection = this.connection;

        let sql = "UPDATE `User` SET `email` = ?, `nickname` = ?,`password` = ? WHERE `id` = ?"; // 記得這回傳依舊是list
        return connection.promise().execute(sql, [ user.email, user.nickname, user.password, user.id ]);

    }

    findById(id: number): Promise<User | null> {

        let connection = this.connection;

        let sql = "SELECT * FROM `User` WHERE `id` = ?"; // 記得這回傳依舊是list

        return new Promise(async (resolve, reject) => {

            let rows: any, fields: any;

            try{
                [rows, fields] = await connection.promise().execute(sql, [id]);
            } catch(err) {
                return reject(err);
            }

            let users: User[] = JSON.parse(JSON.stringify(rows));

            if ( users.length === 0 ) {
                return resolve(null);
            }

            let user = users[0];
            
            return resolve(new User(user.id, user.email, user.nickname, user.password));
           
        });

    }

    findByEmail(email: string): Promise<User | null> {

        let connection = this.connection;

        let sql = "SELECT * FROM `User` WHERE `email` = ?"; // 記得這回傳依舊是list

        return new Promise(async (resolve, reject) => {
            let [rows, fields] = await connection.promise().execute(sql, [email]);
            let users: User[] = JSON.parse(JSON.stringify(rows));

            if ( users.length === 0 ) {
                return resolve(null);
            }

            let user = users[0];
            
            return resolve(new User(user.id, user.email, user.nickname, user.password));

           
        });

    }

    findAll(): Promise< User[] > { 

        let sql = "SELECT * FROM `User`";
        let connection = this.connection;
        let returnUsers: User[] = [];

        return new Promise(async (resolve) => {
            let [rows, fields] = await connection.promise().query(sql);

            let jResult= JSON.parse(JSON.stringify(rows));
            for(const user of jResult as User[]) {
                returnUsers.push(new User(user.id, user.email, user.nickname, user.password));
            }
            return resolve(returnUsers);
            
        });

    }

    deleteById(id: number): Promise<any> {

        let connection = this.connection;

        let sql = "DELETE FROM `User` WHERE `id` = ?"; // 記得這回傳依舊是list
        return connection.promise().execute(sql, [ id ]);
    }


}