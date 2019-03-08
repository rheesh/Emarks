const initialState = {
    updateMemo: 0,
    updateTag: 0,
    updateMemoTag: 0,
    updateSearch: 0,
    cursor: -1,
    onEdit: false,
    onDetail: false,
};

export default function (state = initialState, action){
    //console.log('reducer: ', state, action);
    switch(action.type){
        case 'BEGIN_EDIT':
            return Object.assign({}, state,
                {onDetail: true, onEdit: true, cursor: action.cursor, updateMemo: state.updateMemo+1} );
        case 'END_EDIT':
            return Object.assign({}, state, {onEdit: false} );
        case 'BEGIN_DETAIL':
            return Object.assign({}, state, {onDetail: true, onEdit: false, cursor: action.cursor} );
        case 'END_DETAIL':
            return Object.assign({}, state, {onDetail: false, onEdit: false} );
        case 'SET_CURSOR':
            return Object.assign({}, state, {cursor: action.cursor} );
        case 'UPDATE_MEMO':
            return Object.assign({}, state, {updateMemo: state.updateMemo + 1} );
        case 'UPDATE_TAG':
            return Object.assign({}, state, {updateTag: state.updateTag + 1} );
        case 'UPDATE_MEMO_TAG':
            return Object.assign({}, state, {updateMemoTag: state.updateMemoTag + 1} );
        case 'UPDATE_SEARCH':
            return Object.assign({}, state, {
                updateSearch: state.updateSearch + 1,
                onDetail: false,
                onEdit: false,
            } );
        case 'INIT_DB_SUCCESS':
            return Object.assign({}, state, {
                cursor: action.cursor,
                updateMemo: state.updateMemo + 1,
                updateTag: state.updateTag + 1,
                updateMemoTag: state.updateMemoTag + 1,
            } );
        case 'INIT_DB_FAIL':
            return state;
        case 'CLEAR_DB_SUCCESS':
            return Object.assign({}, state, {
                cursor: action.cursor,
                updateMemo: state.updateMemo + 1,
                updateTag: state.updateTag + 1,
                updateMemoTag: state.updateMemoTag + 1,
            } );
        case 'CLEAR_DB_FAIL':
            return state;
        default:
            return state;
    }
}