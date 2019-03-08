/**
 * @providesModule lib
 * @Purpose Interface for expo SQLite module
 * @author Seungho.Yi
 * @email rh22sh@gmail.com
 * @license MIT
 */
'use strict';

import Tag from './Tag';
import lib from "./lib";

export default class TagMap {

    constructor(iterable=null){
        this._tags = new Map();
        if(iterable!==null){
            for(let tag of iterable.values()){
                 this.set(tag);
            }
        }
    }

    static isTagMap(obj){
        return (obj instanceof TagMap)
    }

    async read() {
        let rs = await lib.readTag();
        this._tags = new Map();
        for (let i of rs.rows["_array"]) {
            let tag = new Tag(i.id, i.name, i.desc);
            this.set(tag);
        }
    }

    clear(){
        this._tags.clear();
    }

    values() {
        return Array.from(this._tags.values());
    }

    get length() {
        return this._tags.size;
    }

    has(name) {
        if(Tag.isTag(name)) name = name.name;
        return this._tags.has(name);
    }

    get(name) {
        return this._tags.get(name);
    }

    set(tag) {
        if(Tag.isTag(tag))
            return this._tags.set(tag.name, tag);
        else
            return null;
    }

    delete(name) {
        return this._tags.delete(name);
    }

    async add(name, desc='') {
        if(! name) name = name.trim();
        if((! name) || this.has(name)) return null;
        let tag = await Tag.create(name, desc);
        this.set(tag);
        return tag;
    }

    remove(name) {
        this.get(name).remove();
        return this._tags.delete(name);
    }

    equal(obj){
        if(TagMap.isTagMap(obj)){
            for(let tag of obj.values()){
                if(! this.has(tag.name))
                    return false;
            }
            return false;
        }else if(Array.isArray(obj)){
            for(let tag of obj){
                if(! this.has(tag.name))
                    return false;
            }
            return false;
        }
        return false;
    }
}
