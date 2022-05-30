import mysql from "mysql2";
import 'dotenv/config';

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

export function useConnectionPool(databaseName?: string) {

  let dbName: string;
  if( databaseName ) {
    dbName = databaseName;
  } else {
    dbName = process.env.DB_NAME as string;
  }

  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    port: process.env.DB_PORT as unknown as number,
    database: dbName,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

}




export function createNewDatabase(databaseName: string): Promise<mysql.Connection> { // return newConnection

  return new Promise((resolve) => {
    
    var connection: mysql.Connection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PWD,
      port: process.env.DB_PORT as unknown as number
    });

    connection.connect(function (err) {
      if (err) throw err;

      connection.execute("CREATE DATABASE IF NOT EXISTS " + databaseName, function (err, result) {
        if (err) throw err;

        let newConnection: mysql.Connection = mysql.createConnection({
          host: process.env.DB_HOST,
          user: process.env.DB_USER,
          password: process.env.DB_PWD,
          database: databaseName,
          port: process.env.DB_PORT as unknown as number
        });
        connection.end();
        return resolve(newConnection as any);

      });

    });
    
  });


}


export function deletesDatabase(databaseName: string): Promise<void> { // return newConnection

  return new Promise((resolve) => {
    
    var connection: mysql.Connection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PWD,
      port: process.env.DB_PORT as unknown as number
    });

    connection.connect(function (err) {
      if (err) throw err;

      connection.execute("DROP DATABASE IF EXISTS " + databaseName , function (err, result) {
        if (err) throw err;
        connection.end();
        return resolve();
      });

    });
    
  });


}
