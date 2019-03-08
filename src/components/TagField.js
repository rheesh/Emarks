import React from 'react';
import { StyleSheet, View, ScrollView, ViewPropTypes, TouchableOpacity} from 'react-native';
import { connect } from 'react-redux';
import { Icon, Button, Text } from 'native-base';
import PropTypes from 'prop-types';
import Common from '../api/Common';
import * as Actions from '../actions';
import DB from '../api/DB';
import TagSelect from './TagSelect';
import Memo from "../api/Memo";

class TagField extends React.Component {

    static propTypes = {
        onLayout: PropTypes.func,
        onPress: PropTypes.func,
        memo: PropTypes.object,
        style: ViewPropTypes.style,
        iconType: PropTypes.string,
        icon: PropTypes.string,
        placeholder: PropTypes.string,
    };

    static defaultProps = {
        onLayout: null,
        onPress: null,
        memo: null,
        style: {},
        iconType: "MaterialCommunityIcons",
        icon: 'tag-multiple',
        placeholder: 'Touch here and select tags or create',
    };

    constructor(props) {
        super(props);
        this.selected = null;
        this.memo = null;
        this.tagSelect = null;
        this.setSelected(props);
    }

    setSelected(props, nextProps=null) {
        this.memo = props.memo;
        if(this.memo){
            this.selected = DB.tagsOfMemo(this.memo);
        }else{
            this.selected = DB.searchTags;
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if(this.memo === null && nextProps.memo === null){
            if(this.props.updateSearch !== nextProps.updateSearch)
                this.selected = DB.searchTags;
            else return;
        }
        if(Memo.isMemo(this.memo) && this.memo.equal(nextProps.memo)){
            if(this.props.updateMemoTag !== nextProps.updateMemoTag)
                this.selected = DB.tagsOfMemo(this.memo);
            else return;
        }
        this.setSelected(nextProps);
    }

    _onLayout = (e) => {
        if(this.props.onLayout)
            this.props.onLayout(e);
    };

    _onPress = (e) => {
        if(this.props.onPress)
            this.props.onPress();
        this.tagSelect.open();
    };

    _onClose = (state) => {
        if(this.memo){
            if(state.select) this.props.updateMemoTag();
        }else{
            if(state.select) this.props.updateSearch();
        }
    };

    _renderTags(styles) {
        let content;
        if (this.selected === null || this.selected.length === 0){
            content = (
                <Text style={styles.placeholder} ellipsizeMode={'tail'} numberOfLines={1}>
                    {this.props.placeholder}
                </Text>
            )
        }else{
            content =this.selected.values().map((v, k) => {
                    return (
                        <Button key={k} iconRight light rounded small style={styles.tagButton}
                                onPress={this._onPress} >
                            <Text>{v.name}</Text>
                        </Button>
                    );
                }
            )
        }
        return (
            <ScrollView horizontal={true} keyboardShouldPersistTaps={'never'}>
                { content }
            </ScrollView>
        );
    }

    render() {
        const styles = this.getStyle(0, 0);
        const { icon, iconType, placeholder } = this.props;
        return (
            <View style={[styles.layout, this.props.style]} onLayout={this._onLayout}>
                <Button transparent style={styles.iconButton}>
                    <Icon style={styles.iconStyle} type={iconType} name={icon} />
                </Button>
                <TouchableOpacity style={styles.tagField} onPress={this._onPress}
                                  accessibilityLabel={placeholder}>
                    {this._renderTags(styles)}
                </TouchableOpacity>
                <TagSelect ref={ e => { this.tagSelect = e; } } onClose={this._onClose}
                           memo={this.memo} selected={this.selected}/>
            </View>
        );
    }

    getStyle(w, h) {
        return StyleSheet.create({
            layout: {
                flex: 1,
                display : 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                height: 48,
                maxHeight: 48,
            },
            iconButton: {
                alignItems: 'stretch',
                width:40,
                padding:0,
                margin:0,
            },
            iconStyle: {
                padding:0,
                margin:0,
                marginLeft:0,
                marginRight:0,
                justifyContent:'space-around',
            },
            form: {
                flex: 1,
                backgroundColor: '#DDDDDD',
                paddingTop: 8,
            },
            tagField: {
                flex: 1,
                display : 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                backgroundColor: Common.brandLight,
                marginTop: 5,
                marginBottom: 5,
                marginLeft: 4,
                height: 28,
            },
            tagButton: {
                backgroundColor: 'white',
                marginHorizontal: 4
            },
            placeholder: {
                color: Common.color.placeholderText,
            }
        });
    };
}

function mapStateToProps(state) {
    return {
        updateMemoTag: state.updateMemoTag,
        updateSearch : state.updateSearch,
        onEdit       : state.onEdit,
    }
}

function mapDispatchToProps(dispatch, ownProps) {
    return {
        updateSearch  : () => dispatch(Actions.updateSearch()),
        updateMemoTag : () => dispatch(Actions.updateMemoTag()),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(TagField);

