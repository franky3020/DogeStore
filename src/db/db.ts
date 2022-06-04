import mysql from "mysql2/promise";
import 'dotenv/config';

export async function createNewDatabase(databaseName: string): Promise<void> {

  let connection: mysql.Connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    port: process.env.DB_PORT as unknown as number
  });

  await connection.execute("CREATE DATABASE IF NOT EXISTS " + databaseName);
  connection.end();
}


export async function deletesDatabase(databaseName: string): Promise<void> {


  let connection: mysql.Connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    port: process.env.DB_PORT as unknown as number
  });

  await connection.execute("DROP DATABASE IF EXISTS " + databaseName);
  connection.end();

}
