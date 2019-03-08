/**
 * @providesModule lib
 * @Purpose All query for mdnote
 * @author Seungho.Yi
 * @email rh22sh@gmail.com
 * @license MIT
 */
'use strict';

import SimpleSQLite from './SimpleSQLite';

const dbName = 'todo.db';

const initSql = [ 'create table if not exists items (id integer primary key not null, title text, body text);',
                  'create table if not exists tags (id integer primary key not null, name text, desc text);',
                  'create table if not exists item_tag (id integer primary key not null, item_id integer, tag_name text);',
                ];

const clearSql = [
    'drop table if exists items;',
    'drop table if exists tags;',
    'drop table if exists item_tag;',
];

export default {

    isClose: function() {
        return SimpleSQLite.isClose();
    },

    open: function() {
        return SimpleSQLite.openDatabase(dbName);
    },

    clear: async function() {
        return await SimpleSQLite.multiQuery( clearSql );
    },

    init: async function() {
        return await SimpleSQLite.multiQuery( initSql );
    },

    createMemo: async function( title, body ) {
        return await SimpleSQLite.query(`insert into items (title, body) values (?, ?)`, [title, body]);
    },

    readMemo: async function() {
        return await SimpleSQLite.query(`select * from items order by id asc`);
    },

    updateMemo: async function ( id, title, body ) {
        return await SimpleSQLite.query(`update items set title = ?, body = ? where id = ?;`, [title, body, id]);
    },

    updateMemoTitle: async function ( id, title ) {
        return await SimpleSQLite.query(`update items set title = ? where id = ?;`, [title, id]);
    },

    updateMemoBody: async function ( id, body ) {
        return await SimpleSQLite.query(`update items set body = ? where id = ?;`, [body, id]);
    },

    deleteMemo: async function ( id) {
        return await SimpleSQLite.query(`delete from items where id = ?;`, [id]);
    },

    createTag: async function( name, desc='') {
        return await SimpleSQLite.query('insert into tags (name, desc) values (?, ?)', [name, desc]);
    },

    readTag: async function(db) {
        return await SimpleSQLite.query(`select * from tags;`);
    },

    deleteTag: async function ( id) {
        return await SimpleSQLite.query(`delete from tags where id = ?;`, [id]);
    },

    createItemTag: async function( item_id, tag_name) {
        return await SimpleSQLite.query('insert into item_tag (item_id, tag_name) values (?, ?)', [item_id, tag_name]);
    },

    readMemoTag: async function() {
        return await SimpleSQLite.query(`select * from item_tag;`);
    },

    deleteMemoTag: async function ( id ) {
        return await SimpleSQLite.query(`delete from item_tag where id = ?;`, [id]);
    }
}