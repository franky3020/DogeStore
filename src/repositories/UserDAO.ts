
import mysql from "mysql2";
import User from "../entity/User";

export default class UserDAO {

    connection: mysql.Connection;

    constructor(connection: mysql.Connection) {
        this.connection = connection;
    }

    create(user: User): Promise<void> {
        let connection = this.connection;

        return new Promise((resolve, reject) => {

            connection.connect(function (err) {

                if (err) throw err;

                if( user.id !== null ) {

                    let sql = "INSERT INTO `User`(`id`,`email`,`nickname`,`password`)VALUES(?,?,?,?)";
                    connection.query(sql, [user.id, user.email, user.nickname, user.password], function (err, result) {
                        if (err) reject(err);
                        return resolve();
                    });


                } else {

                    let sql = "INSERT INTO `User`(`email`,`nickname`,`password`)VALUES(?,?,?)";
                    connection.query(sql, [user.email, user.nickname, user.password], function (err, result) {
                        if (err) reject(err);
                        return resolve();
                    });
                }
        
                

            });

        })
    }

    update(user: User): Promise<void> {
        
        let connection = this.connection;

        let sql = "UPDATE `User` SET `email` = ?, `nickname` = ?,`password` = ? WHERE `id` = ?"; // 記得這回傳依舊是list

        return new Promise((resolve, reject) => {
            connection.execute(sql, [ user.email, user.nickname, user.password, user.id ], function (err, result) {
                if (err) throw err;
                return resolve();
                
            });
        });

    }

    findById(id: number): Promise<User | null> {

        let connection = this.connection;

        let sql = "SELECT * FROM `User` WHERE `id` = ?"; // 記得這回傳依舊是list

        return new Promise((resolve, reject) => {
            connection.execute(sql, [id], function (err, result) {
                if (err) throw err;
    
                let users: User[] = JSON.parse(JSON.stringify(result));

                if ( users.length === 0 ) {
                    return resolve(null);
                }

                let user = users[0];
                
                return resolve(new User(user.id, user.email, user.nickname, user.password));
                
            });
        });

    }

    findAll(): Promise< User[] > { 

        let sql = "SELECT * FROM `User`";
        let connection = this.connection;
        let returnUsers: User[] = [];

        return new Promise((resolve) => {
            connection.query(sql, function (err, result) {
                if (err) throw err;
    
                let jResult= JSON.parse(JSON.stringify(result));
                for(const user of jResult as User[]) {
                    returnUsers.push(new User(user.id, user.email, user.nickname, user.password));
                }
                return resolve(returnUsers);
                
            });
        });

    }

    deleteById(id: number): Promise<void> {

        let connection = this.connection;

        let sql = "DELETE FROM `User` WHERE `id` = ?"; // 記得這回傳依舊是list

        return new Promise((resolve, reject) => {
            connection.execute(sql, [ id ], function (err, result) {
                if (err) throw err;
                return resolve();
                
            });
        });
    }


}