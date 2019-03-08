/**
 * @providesModule lib
 * @Purpose Interface for expo SQLite module
 * @author Seungho.Yi
 * @email rh22sh@gmail.com
 * @license MIT
 */
'use strict';

import { SQLite } from 'expo';

let db = null;

let dbName = 'todo.db';

export default class SimpleSQLite {

    static get db(){
        return db;
    }

    static set db(value){
        return db = value;
    }

    static get dbName(){
        return dbName;
    }

    static set dbName(value){
        return dbName = value;
    }

    static sql_real_escape_string(str) {
        return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
            switch (char) {
                case "\0":
                    return "\\0";
                case "\x08":
                    return "\\b";
                case "\x09":
                    return "\\t";
                case "\x1a":
                    return "\\z";
                case "\n":
                    return "\\n";
                case "\r":
                    return "\\r";
                case "\"":
                case "'":
                case "\\":
                case "%":
                    return "\\"+char; // prepends a backslash to backslash, percent, and double/single quotes
            }
        });
    }

    static get isClosed(){
        if (SimpleSQLite.db === null) return true;
        else return SimpleSQLite.db["_db"]["_closed"];
    }

    static async sleep(ms) {
        return new Promise(res => setTimeout(res, ms));
    }

    static open(dbName=null) {
        if (dbName)
            SimpleSQLite.dbName = dbName;
        if (SimpleSQLite.isClosed)
            SimpleSQLite.db = SQLite.openDatabase(SimpleSQLite.dbName);
        //console.log("SimpleSQLite : ", SimpleSQLite.db);
        return SimpleSQLite.db;
    }

    static async query(sql, params = null) {
        SimpleSQLite.open();
        return new Promise((resolve, reject) => {
            SimpleSQLite.db.transaction(
                tx => {
                    tx.executeSql(sql, params, (_, rs = null) => resolve(rs));
                },
                (err) => reject(err)
            );
        });
    }

    static async multiQuery( sqls ) {
        SimpleSQLite.open();
        return new Promise((resolve, reject) => {
            SimpleSQLite.db.transaction(tx => {
                for (let sql of sqls)
                    tx.executeSql(sql);
            }, (err) => reject(err), () => resolve());
        });
    }
}