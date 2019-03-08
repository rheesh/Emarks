/**
 * @providesModule lib
 * @Purpose Interface for expo SQLite module
 * @author Seungho.Yi
 * @email rh22sh@gmail.com
 * @license MIT
 */
'use strict';

import Memo from './Memo';
import lib from "./lib";

export default class MemoMap {

    constructor(iterable=null){
        this._memos = new Map();
        this._cursor = -1;
        if(iterable!==null){
            for(let memo of iterable.values()){
                this.set(memo);
            }
        }
    }

    static isMemoMap(obj){
        return (obj instanceof MemoMap)
    }

    async read() {
        let rs = await lib.readMemo();
        this._memos = new Map();
        let memo;
        for (let i of rs.rows["_array"]){
            memo = new Memo(i.id, i.title, i.body);
            this._memos.set( memo.id, memo );
        }
        if (memo) this.cursor = memo.id;
    }

    clear(){
        this._memos.clear();
        this._cursor = -1;
    }

    values() {
        return Array.from(this._memos.values()).reverse();
    }

    get length() {
        return this._memos.size;
    }

    get current() {
        return this.has(this.cursor) ? this.get(this.cursor) : null;
    }

    get cursor() {
        return this._cursor;
    }

    set cursor(key) {
        if (this.has(key)) this._cursor = key;
        else this._cursor = -1;
    }

    has(key) {
        if(Memo.isMemo(key)) key = key.id;
        return this._memos.has(key);
    }

    get(key) {
        return this._memos.get(key);
    }

    set(memo) {
        if(Memo.isMemo(memo)){
            if(this.length === 0) this._cursor = memo.id;
            this._memos.set(memo.id, memo);
            return this;
        }else return null;
    }

    delete(key) {
        return this._memos.delete(key);
    }

    remove(key) {
        if(key === this.cursor){
            if(this.length === 1) this._cursor = -1;
            else{
                let memos = this.values();
                this._cursor = ( memos[0].id === key ? memos[1].id : memos[0].id )
            }
        }
        this.get(key).remove();
        return this._memos.delete(key);
    }

    async add(title, body) {
        let memo = await Memo.create(title, body);
        this.set(memo);
        return memo;
    }

    equal(obj){
        if(MemoMap.isMemoMap(obj)){
            for(let memo of obj.values()){
                if(! this.has(memo.id))
                    return false;
            }
            return false;
        }else if(Array.isArray(obj)){
            for(let memo of obj){
                if(! this.has(memo.id))
                    return false;
            }
            return false;
        }
        return false;
    }
}
