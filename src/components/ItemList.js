import React from 'react';
import { StyleSheet, ListView, Alert, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import {Button, Icon, List, ListItem, Text} from 'native-base';
import DB from '../api/DB';
import * as Actions from "../actions";
import PropTypes from "prop-types";
import Common from '../api/Common';

class ItemList extends React.Component {

    static propTypes = {
        height: PropTypes.number.isRequired,
    };

    constructor(props){
        super(props);
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1.id !== r2.id || r1.title !== r2.title });
        this._opened = null;
        this._rows = null;
        this._selected = null;
        this._itemHeight = 46;
        this.state = {
            list : DB.searchMemo()
        };
    }

    componentDidMount() {
        if (this.state.list.length > 0)
            if ( this.props.cursor < 0 || this.state.list.find( memo => memo.id === this.props.cursor) < 0)
                this.props.setCursor(this.state.list[0].id);
    }

    componentWillReceiveProps(nextProps){
        let list = this.state.list;
        if(this.props.updateSearch !== nextProps.updateSearch || this.props.updateMemo !== nextProps.updateMemo){
            list = DB.searchMemo();
            this.setState({list : list});
        }
        if (list.length > 0) {
            if ( nextProps.cursor < 0 || list.findIndex( memo => memo.id === nextProps.cursor) < 0)
                nextProps.setCursor(list[0].id);
        } else if ( nextProps.cursor >= 0 ){
            nextProps.setCursor();
        }
    }

    closeRow(key=null) {
        if(key !== null)
            this._rows[key].props.closeRow();
        if(this._opened !== null && this._opened !== key){
            this._rows[this._opened].props.closeRow();
            this._opened = null;
        }
    }

    removeSelected = () => {
        if(this._rows && this._selected){
            this.closeRow();
            DB.removeMemo(DB.memos.current);
            const list = DB.searchMemo();
            this.setState({list : list});
            if(list.length > 0) this.props.setCursor(list[0].id);
            else this.props.setCursor();
            this.props.endDetail();
        }
    };

    remove(memo, secId, rowId, rowMap) {
        this._rows = rowMap;
        Alert.alert(
            'Confirm',
            `Are you sure you want to delete the "${memo.title}" memo?`,
            [
                {
                    text: 'Cancel',
                    onPress: () => {
                        const key = `${secId}${rowId}`;
                        this.closeRow(key);
                    },
                    style: 'cancel'},
                {
                    text: 'OK',
                    onPress: () => {
                        const key = `${secId}${rowId}`;
                        this.closeRow(key);
                        DB.removeMemo(memo);
                        const list = DB.searchMemo();
                        this.setState({list : list});
                        if(this._selected === key) {
                            if(list.length > 0) this.props.setCursor(list[0].id);
                            else this.props.setCursor();
                        }
                    }
                },
            ]
        );
    }

    detail(memo, secId, rowId, rowMap) {
        this._rows = rowMap;
        this.closeRow();
        this.props.beginDetail(memo.id);
    }

    renderFooter = () => {
        const length = this.state.list.length;
        if(length === 0)
            return (
                <Text style={this.styles.empty}>
                    No Memos!
                </Text>
            );
        else {
            const height = this.props.height - length * this._itemHeight;
            if(height>0){
                return (
                    <TouchableOpacity style={{height: height}}
                                      onPress={this.props.endDetail}
                                      accessibilityLabel={'Blank area'}>
                    </TouchableOpacity>
                );
            }
            else return null;
        }
    };

    render() {
        const { cursor } = this.props;
        let { list } = this.state;
        let ds = this.ds.cloneWithRows(list);

        return (
            <List style={this.styles.list}
                  accessibilityLabel={'Memo list'}
                  renderFooter={this.renderFooter}
                  leftOpenValue={50}
                  rightOpenValue={-50}
                  dataSource={ds}
                  renderRow={ (memo, secId, rowId, rowMap) => {
                      this._rows = rowMap;
                      const key = `${secId}${rowId}`;
                      const selected = memo.id === cursor;
                      if(selected) this._selected = key;
                      return (
                          <ListItem key={key}
                                    selected={ selected }
                                    onPress={() => this.detail(memo, secId, rowId, rowMap)}>
                              <Text ellipsizeMode={'tail'} numberOfLines={1} style={{paddingLeft:10}}>
                                  { memo.title }
                              </Text>
                          </ListItem>
                      );
                  }}
                  renderLeftHiddenRow={ (memo, secId, rowId, rowMap) => {
                          this._opened = `${secId}${rowId}`;
                          return (<Button danger onPress={() => this.remove(memo, secId, rowId, rowMap)}>
                              <Icon active name="trash"/>
                          </Button>);
                      }
                  }
                  renderRightHiddenRow={ (memo, secId, rowId, rowMap) => {
                          this._opened = `${secId}${rowId}`;
                          return (<Button danger onPress={() => this.remove(memo, secId, rowId, rowMap)}>
                              <Icon active name="trash"/>
                          </Button>);
                      }
                  }
            />
        )
    }

    styles = StyleSheet.create({
        list : {
            flex: 1,
            flexDirection: 'column',
            display : 'flex',
            height: this.props.height,
        },
        empty : {
            paddingTop: 100,
            alignSelf: 'center',
            fontSize: Common.fontSizeH1,
            color: "#E0E0E0",
        },
        footer : {
            bottom: 0,
            right: 0,
            left: 0,
            top: 0,
            backgroundColor: 'blue',
        }
    });
}


function mapStateToProps(state) {
    return {
        cursor      : state.cursor,
        onDetail    : state.onDetail,
        updateSearch: state.updateSearch,
        updateMemo  : state.updateMemo,
    }
}

function mapDispatchToProps(dispatch, ownProps) {
    return {
        endEdit: () => dispatch(Actions.endEdit()),
        beginDetail: (id) => dispatch(Actions.beginDetail(id)),
        endDetail  : () => dispatch(Actions.endDetail()),
        setCursor: (id) => dispatch(Actions.setCursor(id)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false, withRef: true })(ItemList);
