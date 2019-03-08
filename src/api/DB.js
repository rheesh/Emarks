'use strict';

import lib from './lib';
import MemoMap from './MemoMap';
import TagMap from './TagMap';
import MemoTagList from './MemoTagList';
import Memo from "./Memo";

let _initialized = false;
let _memos = new MemoMap();
let _tags = new TagMap();
let _memoTags = new MemoTagList();
let _searchKey = '';
let _searchTags = new TagMap();

export default class DB {

    static get initialized() {
        return _initialized;
    }
    static set initialized(x) {
        return _initialized = x;
    }

    static get memos() {
        return _memos;
    }
    static set memos(x) {
        return _memos = x;
    }

    static get tags() {
        return _tags;
    }
    static set tags(x) {
        return _tags = x;
    }

    static get memoTags() {
        return _memoTags;
    }
    static set memoTags(x) {
        return _memoTags = x;
    }

    static get searchKey() {
        return _searchKey;
    }
    static set searchKey(x) {
        return _searchKey = x;
    }

    static get searchTags() {
        return _searchTags;
    }
    static set searchTags(x) {
        return _searchTags = x;
    }

    static async init() {
        if ( ! DB.initialized ){
            try{
                await lib.init();
                let l = await this.reload();
                DB.initialized = ( l >= 0 );
            } catch (err){
                console.log("init in DB.js", err);
            }
        }
        return DB.initialized;
    }

    static async clear() {
        try{
            await lib.clear();
            this.memos.clear();
            this.tags.clear();
            this.memoTags.clear();
            await lib.init();
            return true;
        } catch (err) {
            console.log("clear in DB.js", err);
            return false;
        }
    }

    static async reload() {
        try{
            await this.memos.read();
            await this.tags.read();
            await this.memoTags.read();
            return this.memos.length;
        } catch (err){
            console.log("reload in DB.js", err);
            return -1;
        }
    }

    static tagsOfMemo(memo) {
        if (Number.isInteger(memo)) memo = this.memos.get(memo);
        let lst = this.memoTags.getByMemo(memo);
        let m = new TagMap();
        lst.forEach( mt => {
            let t = DB.tags.get(mt.tagName);
            m.set(t);
        });
        return m;
    }

    static memoHasTags(memo, tags) {
        if( tags.size || tags.length ){
            for (let t of tags.values()){
                if (DB.memoTags.has(memo, t)) return true;
            }
            return false;
        } else return true;
    }

    static searchMemo() {
        let list = this.memos.values();
        return list.filter(memo => memo.contains(DB.searchKey) && this.memoHasTags(memo, DB.searchTags) );
    }

    static removeMemo(memo){
        if (Number.isInteger(memo)) memo = this.memos.get(memo);
        if (Memo.isMemo(memo)) {
            this.memoTags.removeByMemo(memo);
            this.memos.remove(memo.id);
        }
    }

    static memosOfTag(tag) {
        let lst = this.memoTags.getByTag(tag);
        let m = new MemoMap();
        for (let mt of lst)
            m.set(this.memos.get(mt.memoId));
        return m;
    }

    static removeTag(tag) {
        if ( ! tag.name ) tag = this.tags.get(tag);
        this.memoTags.removeByTag(tag);
        this.tags.remove(tag.name);
    }
};