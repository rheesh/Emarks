/**
 * @providesModule lib
 * @Purpose Interface for expo SQLite module
 * @author Seungho.Yi
 * @email rh22sh@gmail.com
 * @license MIT
 */
'use strict';

import Common from './Common';
import lib from './lib';

export default class Memo {

    constructor(id, title, body){
        this._id = id;
        this._title = title;
        this._body = body;
    }

    static async create(title, body){
        try{
            let rs = await lib.createMemo( title, body );
            let id = rs.insertId;
            return new Memo(id, title, body);
        } catch (err){
            console.log("create in Memo.js", err);
            return null;
        }
    }

    static isMemo(obj){
        return (obj instanceof Memo);
    }

    get id() {
        return this._id;
    }

    get title() {
        return this._title;
    }

    get body() {
        return this._body;
    }

    set title(txt) {
        try{
            txt = txt.trim();
            lib.updateMemoTitle( this.id, txt );
            this._title = txt;
            return this._title;
        } catch (err){
            console.log("updateTitle in Memo.js", err);
            return null;
        }
    }

    set body(txt) {
        try{
            txt = Common.rtrim(txt);
            lib.updateMemoBody( this.id, txt);
            this._body = txt;
            return this._body;
        } catch (err){
            console.log("updateBody in Memo.js", err);
            return null;
        }
    }

    update(title, body){
        try{
            lib.updateMemo( this.id, title, body);
            this._title = title;
            this._body = body;
            return this;
        } catch (err){
            console.log("update in Memo.js", err);
            return null;
        }
    }

    remove(){
        try{
            lib.deleteMemo(this.id);
            return this;
        } catch (err){
            console.log("delete in DB.js", err);
            return null;
        }
    }

    equal(other) {
        if(Memo.isMemo(other))
            return this.id === other.id;
        return false;
    }

    contains(key) {
        if (key)
            return ( this.title.toLowerCase().includes(key) || this.body.toLowerCase().includes(key) );
        else
            return true;
    }
}