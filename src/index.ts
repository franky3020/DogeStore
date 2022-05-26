import {connection} from "./mysql";
connection.connect( (err: any) => {
    console.log("error");
    console.log(err);
});
// connection.ping();
