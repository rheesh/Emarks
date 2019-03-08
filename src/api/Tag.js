/**
 * @providesModule lib
 * @Purpose Interface for expo SQLite module
 * @author Seungho.Yi
 * @email rh22sh@gmail.com
 * @license MIT
 */
'use strict';

import lib from './lib';

export default class Tag {

    constructor(id, name, desc){
        this._id = id;
        this._name = name;
        this._desc = desc;
    }

    static async create(name, desc=''){
        try{
            name = name.trim().toLowerCase();
            desc = desc.trim();
            let rs = await lib.createTag( name, desc );
            let id = rs.insertId;
            return new Tag(id, name, desc);
        } catch (err){
            console.log("create in Tag.js", err);
            return null;
        }
    }

    static isTag(obj){
        return (obj instanceof Tag);
    }

    get id() {
        return this._id;
    }

    get name() {
        return this._name;
    }

    get desc() {
        return this._desc;
    }

    equal(other) {
        if (Tag.isTag(other))
            return this.name === other.name;
        else{
            try{
                return this.name === other.trim().toLowerCase();
            } catch (err) {
                return false;
            }
        }
    }

    remove() {
        try{
            lib.deleteTag(this.id);
            return this;
        } catch (err){
            console.log("delete in DB.js", err);
            return null;
        }
    }
}