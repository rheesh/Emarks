import TagMap from '../api/TagMap';
import DB from '../api/DB';
import Common from "../api/Common";

export function beginEdit(id=null){
    return (dispatch, getState) => {
        if(id !== null) DB.memos.cursor = id;
        dispatch({ type: 'BEGIN_EDIT', cursor: DB.memos.cursor })
    }
}

export function endEdit(){
    return (dispatch, getState) => {
        dispatch({ type: 'END_EDIT'})
    }
}

export function beginDetail(id=null){
    return (dispatch, getState) => {
        if(id !== null) DB.memos.cursor = id;
        dispatch({ type: 'BEGIN_DETAIL', cursor: DB.memos.cursor })
    }
}

export function endDetail(){
    return (dispatch, getState) => {
        dispatch({ type: 'END_DETAIL'})
    }
}

export function setCursor(id=null){
    return (dispatch, getState) => {
        DB.memos.cursor = (id===null ? -1 : id);
        dispatch({ type: 'SET_CURSOR', cursor: DB.memos.cursor })
    }
}

export function updateMemo() {
    return (dispatch, getState) => {
        dispatch({ type: 'UPDATE_MEMO'})
    }
}

export function updateTag() {
    return (dispatch, getState) => {
        dispatch({ type: 'UPDATE_TAG'})
    }
}

export function updateMemoTag() {
    return (dispatch, getState) => {
        dispatch({ type: 'UPDATE_MEMO_TAG'})
    }
}

export function updateSearch() {
    return (dispatch, getState) => {
        dispatch({ type: 'UPDATE_SEARCH'})
    }
}

export function initDB(){
    return async (dispatch, getState) => {
        const result = await DB.init();
        if(result){
            dispatch({ type: 'INIT_DB_SUCCESS', cursor: DB.memos.cursor})
        }else{
            console.log('INIT_DB_FAIL');
            dispatch({ type: 'INIT_DB_FAIL'})
        }
    }
}

export function clearDB(){
    return async (dispatch, getState) => {
        const result = await DB.clear();
        if(result){
            console.log('CLEAR_DB_SUCCESS');
            dispatch({ type: 'CLEAR_DB_SUCCESS', cursor: DB.memos.cursor})
        }else{
            console.log('CLEAR_DB_FAIL');
            dispatch({ type: 'CLEAR_DB_FAIL'})
        }
    }
}

