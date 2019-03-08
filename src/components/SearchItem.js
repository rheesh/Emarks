import React from 'react';
import { connect } from 'react-redux';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { Form, Item, Icon, Input, Button, Text, variables } from 'native-base';
import EStyleSheet from 'react-native-extended-stylesheet';
import Common from '../api/Common';
import * as Actions from "../actions";
import TagField from "./TagField";
import DB from '../api/DB';

class SearchItem extends React.Component {
    constructor(props){
        super(props);
        this.searchKey = '';
        this.myinput = null;
        this.tagSelect = null;
        this._onSearchPress = this._onSearchPress.bind(this);
    }

    _onSearchPress() {
        this.myinput._root.blur();
        DB.searchKey = this.searchKey;
        this.props.updateSearch();
    }

    render() {
        let tags = [];
        DB.tags.values().forEach((v, k) => tags.push({ id: k, label: v.name}) );
        return (
            <View style={styles.form} {...this.props}>
                <View style={styles.tagBar}>
                    <TagField icon={'filter'} onPress={this.props.endDetail}/>
                </View>
                <Item rounded >
                    <Input ref={(e) => {this.myinput = e;}}
                           style={styles.input}
                           selectTextOnFocus
                           defaultValue={this.searchKey}
                           onFocus={this.props.endDetail}
                           onChangeText={text => this.searchKey = text}
                           onSubmitEditing={this._onSearchPress}
                           placeholder={'Input keyword to search'}
                           placeholderTextColor={Common.color.placeholderText}
                    />
                    <Button transparent onPress={this._onSearchPress}>
                        <Icon type="MaterialCommunityIcons" name="magnify" style={styles.icon} />
                    </Button>
                </Item>
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        updateTag   : state.updateTag,
        updateSearch: state.updateSearch,
    }
}

function mapDispatchToProps(dispatch, ownProps) {
    return {
        endDetail     : () => dispatch(Actions.endDetail()),
        updateSearch: () => dispatch(Actions.updateSearch()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchItem);

const styles = EStyleSheet.create({
    form: {
        display : 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        padding: 0,
        margin: 4,
        height: 96,
    },
    tagBar: {
        flex: 1,
        display : 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        height: 48,
    },
    tagField: {
        flex: 1,
        textAlignVertical: 'center',
        marginBottom: 0,
        height: 40,
    },
    icon: {
        fontSize: 28,
        color: Common.color.primary,
    },
    input : {
        height: 48,
        padding: 4,
        margin: 0,
        fontSize: 16,
    },
    item: {
        borderWidth: 1,
        borderColor: '#333',
        backgroundColor: '#FFF',
    },
    label: {
        color: '#333'
    },
    itemSelected: {
        backgroundColor: '#333',
    },
    labelSelected: {
        color: '#FFF',
    },
});
