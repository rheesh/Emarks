import React from 'react';
import {TouchableOpacity, StyleSheet, FlatList, View, ScrollView, ViewPropTypes} from 'react-native';
import { Popup } from 'react-native-image-kit';
import { Input, Icon, Button, Text, CardItem, Body, Card, Item } from 'native-base';
import PropTypes from 'prop-types';
import Memo from '../api/Memo';
import TagMap from '../api/TagMap';
import DB from '../api/DB';
import Common from '../api/Common';

export default class TagSelect extends React.Component {

    static propTypes = {
        onChange: PropTypes.func,
        onClose: PropTypes.func,
        onOpen: PropTypes.func,
        selected: PropTypes.object,
        memo: PropTypes.object,
    };

    static defaultProps = {
        onChange: null,
        onClose: null,
        onOpen: null,
        selected: null,
        memo: null,
    };

    constructor(props) {
        super(props);
        this.selected = props.selected;
        this.memo = null;
        this.selected = null;
        this.setSelected(props);
        this.textInput = null;
        this.textInputValue = '';
        this.message = '';
        this.state = {
            mode: 0, // 0: select, 1: edit
            open: false,
            create: 0,
            select: 0,
        };
    }

    setSelected(props) {
        this.memo = props.memo;
        if(this.memo){
            this.selected = TagMap.isTagMap(props.selected) ? props.selected : DB.tagsOfMemo(this.memo);
        }else{
            this.selected = DB.searchTags;
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if(this.memo === nextProps.memo) return;
        if(Memo.isMemo(this.memo) && this.memo.equal(nextProps.memo)) return;
        this.setSelected(nextProps);
    }

    open() {
        this.message = '';
        this.setState({
            mode: 0,
            open: true,
            create: 0,
            select: 0,
        });
        if(this.props.onOpen)
            this.props.onOpen(this.state, this.selected);
    }

    close() {
        this._onClosed();
    }

    _onCancel = () => { this._onClosed() };

    _onClosed = () => {
        if(this.state.open)
            this.setState({ open: false, },
                () => {
                    if(this.props.onClose){
                        this.props.onClose(this.state, this.selected);
                    }
                }
            );
    };

    _createTag = async (e) => {
        //let name = e.nativeEvent.text;
        let name = this.textInputValue.trim();
        if(name){
            const tag = await DB.tags.add(name);
            if(tag === null){
                this.message = `Can not create tag ${name}.`;
            }else{
                this.textInput._root.clear();
                this.textInputValue = '';
            }
            this.setState({create: this.state.create+1});
        }
    };

    _deleteTag = async (name) => {
        if(name){
            const result = DB.tags.remove(name);
            if(this.selected && this.selected.has(name)) this.selected.delete(name);
            if(! result){
                this.message = `Can not remove tag ${name}.`;
            }
            this.setState({create: this.state.create});
        }
    };

    _selectTag = (tag) => {
        if(tag){
            if(this.memo){
                if(DB.memoTags.has(this.memo, tag))
                    DB.memoTags.remove(this.memo.id, tag.name);
                else
                    DB.memoTags.add(this.memo, tag);
            }
            if(this.selected.has(tag))
                this.selected.delete(tag.name);
            else
                this.selected.set(tag);
            this.setState({select: this.state.select+1});
            if(this.props.onChange)
                this.props.onChange(this.selected);
        }
    };

    touchTab(mode) {
        if(this.state.mode !== mode){
            this.setState({mode: mode});
        }
    }

    _renderTab(mode){
        let tabStyle = [[styles.tab], [styles.tab]];
        tabStyle[mode].push(styles.selectedTab);
        let titleStyle = [[styles.title], [styles.title]];
        titleStyle[mode].push(styles.selectedTitle);
        let Wrapper0 = mode === 0 ? View : TouchableOpacity;
        let Wrapper1 = mode === 0 ? TouchableOpacity : View;
        return (
            <CardItem header style={styles.header}>
                <Wrapper0 style={tabStyle[0]} onPress={()=>this.touchTab(0)}>
                    <Text style={titleStyle[0]}> Select Tag </Text>
                </Wrapper0>
                <Wrapper1 style={tabStyle[1]} onPress={()=>this.touchTab(1)}>
                    <Text style={titleStyle[1]}> Edit Tag </Text>
                </Wrapper1>
            </CardItem>
        );
    }

    _renderBody(mode){
        if(mode===0)
            return (
                <Body>
                    <ScrollView contentContainerStyle={styles.tagList} style={{height:150}}>
                        {DB.tags.values().map((v, k) =>{
                                const dark = this.selected.has(v);
                                const light = ! dark;
                                return (
                                    <Button key={k} iconRight light={light} dark={dark} rounded small
                                            style={styles.tagButton}
                                            onPress={() => this._selectTag(v)}>
                                        <Text>{v.name}</Text>
                                    </Button>
                                );
                            }
                        )}
                    </ScrollView>
                </Body>
            );
        else
            return (
                <Body>
                    <Item style={{marginTop:0, paddingTop:0, marginBottom:4}}>
                        <Input style={styles.input} defaultValue={this.textInputValue}
                               autoFocus ref={(e) => { this.textInput = e; }}
                               placeholder="New Tag" placeholderTextColor="#D0D0D0"
                               onChangeText={txt => { this.textInputValue = txt; } } onSubmitEditing={this._createTag}/>
                       <Button light rounded onPress={this._createTag}>
                            <Icon style={styles.icon} type="MaterialCommunityIcons" name="tag-plus" />
                       </Button>
                    </Item>
                    <Text style={styles.desc}>{this.message}</Text>
                    <ScrollView contentContainerStyle={styles.tagList} style={{height:120}}>
                        {DB.tags.values().map((v, k) =>
                            (<Button key={k} iconRight light rounded small style={styles.tagButton}
                                     onPress={() => this._deleteTag(v.name)}>
                                <Text>{v.name}</Text>
                                <Icon type="MaterialCommunityIcons" name='close' />
                            </Button>)
                        )}
                    </ScrollView>
                </Body>
        );
    }

    render(){
        let tabStyle = [[styles.tab], [styles.tab]];
        tabStyle[0].push(styles.selectedTab);
        let titleStyle = [[styles.title], [styles.title]];
        titleStyle[0].push(styles.selectedTitle);
        return (
            <Popup style={styles.modal} visible={this.state.open} onDismiss={this._onClosed}>
                <Card style={styles.card}>
                    {this._renderTab(this.state.mode)}
                    <CardItem style={styles.block}>
                        {this._renderBody(this.state.mode)}
                    </CardItem>
                    <CardItem footer style={styles.block}>
                        <Button bordered success style={styles.button} onPress={this._onCancel}>
                            <Text style={styles.successText}>Done</Text>
                        </Button>
                    </CardItem>
                </Card>
            </Popup>
        );
    }
}

const styles = StyleSheet.create({
    tab: {
        flex: 1,
        alignItems: 'center',
        borderBottomWidth: 3,
        borderBottomColor : Common.color.light,
    },
    selectedTab: {
        borderBottomColor : Common.color.primary,
    },
    modal: {
        paddingTop: 20,
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginBottom: 0,
        paddingBottom: 0,
    },
    card: {
        height : 245,
        width : 320,
    },
    input: {
        width: 200,
        color: '#606060',
        marginTop: 0,
        paddingTop: 0,
    },
    title: {
        color: '#303030',
        fontWeight: 'normal',
    },
    selectedTitle: {
        fontWeight: 'bold',
    },
    tagList: {
        flexGrow: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    tagButton:{
        margin: 2,
    },
    desc: {
        marginTop: 8,
        fontSize: 10,
        color: Common.brandDanger,
    },
    button: {
        justifyContent: 'center',
        width: 110,
    },
    successText: {
        color : Common.brandSuccess,
    },
    warningText: {
        color : Common.brandWarning,
    },
    block: {
        justifyContent: 'space-evenly',
    }
});

