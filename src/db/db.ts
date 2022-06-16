import mysql from "mysql2/promise";
import 'dotenv/config';
import { getDBConfig } from "../config/config";

const dbConfig = getDBConfig();

export async function createNewDatabase(databaseName: string): Promise<void> {

	let connection: mysql.Connection = await mysql.createConnection(dbConfig);

	try {

		await connection.execute("CREATE DATABASE IF NOT EXISTS " + databaseName);

	} catch (err) {
		throw err
	} finally {
		connection.end();
	}
}


export async function isDatabaseExist(databaseName: string): Promise<boolean> {

	let connection: mysql.Connection = await mysql.createConnection(dbConfig);

	let rows = [];
	try {

		let [rows_str, fields] = await connection.execute("SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?", [databaseName]);
		rows = JSON.parse(JSON.stringify(rows_str));

	} catch (err) {
		throw err
	} finally {
		connection.end();
	}

	if (rows.length > 0) {
		return true;
	} else {
		return false;
	}

}


export async function deletesDatabase(databaseName: string): Promise<void> {
	let connection: mysql.Connection = await mysql.createConnection(dbConfig);

	try {

		await connection.execute("DROP DATABASE IF EXISTS " + databaseName);

	} catch (err) {
		throw err
	} finally {
		connection.end();
	}

}
