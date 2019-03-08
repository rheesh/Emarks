/**
 * @providesModule lib
 * @Purpose Interface for expo SQLite module
 * @author Seungho.Yi
 * @email rh22sh@gmail.com
 * @license MIT
 */
'use strict';

import lib from './lib'
import MemoTag from "./MemoTag";

export default class MemoTagList {

    constructor(){
        this._memoTags = [];
    }

    async read() {
        let rs = await lib.readMemoTag();
        this._memoTags = [];
        for (let i of rs.rows["_array"]){
            await this.set( new MemoTag(i.id, i.item_id, i.tag_name) );
        }
    }

    clear(){
        this._memoTags = [];
    }

    get values() {
        return this._memoTags
    }

    get length() {
        return this._memoTags.length;
    }

    get(id, name=null) {
        if(name===null)
            return this._memoTags[id];
        else
            return this._memoTags.find( memoTag => memoTag.memoId === id && memoTag.tagName === name );
    }

    set(memoTag) {
        if(memoTag === null) return null;
        return this._memoTags.push(memoTag);
    }

    has(memo, tag) {
        let lst = this._memoTags.filter(memoTag => memoTag.memoId === memo.id && memoTag.tagName === tag.name);
        return lst.length > 0;
    }

    async add(memo, tag){
        if (this.has(memo, tag)) return null;
        let memoTag = await MemoTag.create(memo, tag);
        this.set(memoTag);
        return memoTag;
    }

    remove(id, name=null) {
        if(name===null){
            this.get(id).remove();
            return this._memoTags.splice(id, 1);
        }else{
            let idx = this._memoTags.findIndex( memoTag => memoTag.memoId === id && memoTag.tagName === name );
            if(idx < 0) return [];
            else this.remove(idx);
        }
    }

    getByMemo(memo) {
        return this._memoTags.filter( memoTag => memoTag.memoId === memo.id);
    }

    getByTag(tag) {
        return this._memoTags.filter( memoTag => memoTag.tagName === tag.name);
    }

    removeByMemo(memo) {
        let i = 0;
        while( i < this.length ){
            if (this.get(i).memoId === memo.id)
                this.remove(i);
            else i++;
        }
    }

    removeByTag(tag) {
        let i = 0;
        while( i < this.length ){
            if (this.get(i).tagName === tag.name)
                this.remove(i);
            else i++;
        }
    }
}
