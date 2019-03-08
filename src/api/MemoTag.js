/**
 * @providesModule lib
 * @Purpose Interface for expo SQLite module
 * @author Seungho.Yi
 * @email rh22sh@gmail.com
 * @license MIT
 */
'use strict';

import lib from './lib';

export default class MemoTag {

    constructor(id, memo_id, tag_name){
        this._id = id;
        this._memo = memo_id;
        this._tag = tag_name;
    }

    static async create(memo, tag){
        try{
            let rs = await lib.createItemTag( memo.id, tag.name );
            let id = rs.insertId;
            return new MemoTag(id, memo.id, tag.name);
        } catch (err){
            console.log("create in MemoTag.js", err);
            return null;
        }
    }

    get id() {
        return this._id;
    }

    get memoId() {
        return this._memo;
    }

    get tagName() {
        return this._tag;
    }

    async remove() {
        try{
            await lib.deleteMemoTag(this.id);
            return this;
        } catch (e) {
            console.log("remove in MemoTag.js", e);
            return null;
        }
    }

    equal(other) {
        return this.memoId === other.memoId && this.tagName === other.tagName;
    }
}