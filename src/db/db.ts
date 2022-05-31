import mysql from "mysql2";
import 'dotenv/config';


export function createNewDatabase(databaseName: string): Promise<void> {

  let connection: mysql.Connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    port: process.env.DB_PORT as unknown as number
  });

  return new Promise((resolve, reject) => {
    connection.connect(function (err) {
      if (err) return reject(err);

      connection.execute("CREATE DATABASE IF NOT EXISTS " + databaseName, function (err, result) {
        if (err) return reject(err);
        
        connection.end();
        return resolve();
      });

    });
    
  });
}


export function deletesDatabase(databaseName: string): Promise<void> {

  let connection: mysql.Connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    port: process.env.DB_PORT as unknown as number
  });

  return new Promise((resolve, reject) => {

    connection.connect(function (err) {
      if (err) return reject(err);

      connection.execute("DROP DATABASE IF EXISTS " + databaseName , function (err, result) {
        if (err) return reject(err);
        
        connection.end();
        return resolve();
      });

    });
    
  });


}


export function getNewConnection(databaseName?: string): mysql.Connection {

  let dbName: string;
  if( databaseName ) {
    dbName = databaseName;
  } else {
    dbName = process.env.DB_NAME as string;
  }

  const connection = mysql.createConnection({ // 要注意connection 拿著太久時 會出錯
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: dbName,
    port: process.env.DB_PORT as unknown as number
  });

  return connection;

}