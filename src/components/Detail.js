'use strict';

import React from 'react';
import {Dimensions, View, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import {Input, Icon} from 'native-base';
import EStyleSheet from "react-native-extended-stylesheet";
import PropTypes from "prop-types";

import DB from '../api/DB';
import * as Actions from '../actions';
import Markdown from '../markdown-view';
import {MarkdownEditor} from "../markdown-editor";
import TagField from "../components/TagField";
import Common from '../api/Common';
import {PhotoBrowser} from "../react-native-image-kit";

class Detail extends React.Component {
    static propTypes = {
        height: PropTypes.number.isRequired,
    };

    constructor(props) {
        super(props);
        const { width } = Dimensions.get('window');
        let tags = [];
        DB.tags.values().forEach( (v, k) => tags.push({ id: k, label: v.name}) );
        this.memo = {
            id : null,
            title: '',
            body:  '',
            tags: new Map(),
        };
        this.getCurrent(props);
        this.onEdit = this.props.onEdit;
        this.bodyInput = null;
        this.titleInput = null;
        this.imageKit = null;
        this.titleOnEndEditing = this.titleOnEndEditing.bind(this);
        this.bodyOnEndEditing = this.bodyOnEndEditing.bind(this);
        this.startEdit = this.startEdit.bind(this);
        this.state = {
            width : width > 640 ? width-320 : (width > 480 ? width-240 : width),
            height: props.height,
            tags: tags,
            selectedTags: [],
            titleHeight : 48,
            tagHeight : 48,
            titleState: this.memo.title === "No Title",
        };
        this.checkTitleState();
    }

    checkTitleState(){
        const titleState = this.memo.title === "No Title";
        if(this.state.titleState !== titleState)
            this.setState({titleState: titleState});
    }

    startEdit() {
        if ( ! this.props.onEdit ){
            this.props.beginEdit();
        }
    }

    titleOnEndEditing(e) {
        if(DB.memos.current.title.trim() !== this.memo.title){
            DB.memos.current.title = this.memo.title;
            this.props.updateMemo();
        } else
            this.checkTitleState();
    }

    bodyOnEndEditing(e) {
        if(DB.memos.current.body !== this.memo.body){
            DB.memos.current.body = this.memo.body;
        }
    }

    getCurrent(props){
        if ( DB.memos.has(props.cursor) && this.memo.id !== props.cursor ){
            const memo = DB.memos.current;
            this.memo = {
                id : memo.id,
                title: memo.title,
                body:  memo.body,
                tags: DB.tagsOfMemo(memo),
            };
        }
    }

    componentWillReceiveProps(nextProps){
        if (nextProps.onEdit){
            if(!this.onEdit){
                this.onEdit = true;
            }
        }else{
            if (this.onEdit){
                this.onEdit = false;
                if (this.titleInput._root.isFocused()){
                    this.titleOnEndEditing();
                }
                if (this.bodyInput.textInput.isFocused()){
                    this.bodyOnEndEditing();
                }
            }
        }
        this.getCurrent(nextProps);
        this.checkTitleState();
    }

    componentDidMount() {
        if(this.bodyInput !== null && this.imageKit !== null){
            this.bodyInput.imageKit = this.imageKit;
        }
    }

    componentWillUnmount() {
        if (this.onEdit){
            if (this.titleInput._root.isFocused()){
                this.titleOnEndEditing();
            }
            if (this.bodyInput.textInput.isFocused()){
                this.bodyOnEndEditing();
            }
        }
    }

    onLayout = (e) => {
        const {width, height} = e.nativeEvent.layout;
        if (this.state.height !== height || this.state.width !== width){
            this.setState({ width: width, height: height });
        }
    };

    render() {
        let bodyHeight = this.props.height - this.state.titleHeight - this.state.tagHeight - 6;
        const styles = this.getStyle(this.state.width, bodyHeight);
        return (
            <View onLayout={this.onLayout} style={styles.layout} >
                <PhotoBrowser ref={(e) => { this.imageKit = e; }} pictureList={Common.pictureList}
                              isModal={true} orientation={'auto'}/>
                <View style={styles.title} >
                    <Input ref={(e) => { this.titleInput = e; }}
                           style={styles.titleInput}
                           placeholder={'Memo title'}
                           placeholderTextColor={Common.color.placeholderText}
                           selectTextOnFocus={this.state.titleState}
                           defaultValue={this.memo.title}
                           editable={this.onEdit}
                           onChangeText={(text) => { this.memo.title = text }}
                           onEndEditing={this.titleOnEndEditing} />
                </View>
                <TagField style={styles.tags} memo={this.memo}/>
                <View contentContainerStyle={styles.body} >
                    { this.onEdit ?
                        (<MarkdownEditor placeholder={'Touch here and write a long markdown message'}
                                         placeholderTextColor={Common.color.placeholderText}
                                         defaultValue={this.memo.body}
                                         ref={(e) => { this.bodyInput = e; }}
                                         pictureManager={this.imageKit}
                                         height={bodyHeight}
                                         editorStyle={styles.editorStyle}
                                         borderStyle={styles.mdBorder}
                                         onMarkdownChange={(text) => { this.memo.body = text; } }
                                         onEndEditing={this.bodyOnEndEditing} />) :
                        (<ScrollView style={styles.previewStyle} accessibilityLabel={'Memo Content'}>
                            {this.memo.body ?
                                <Markdown accessibilityLabel={'Markdown Content'} >{this.memo.body}</Markdown> :
                                <Icon type="MaterialCommunityIcons" name="lead-pencil" style={styles.watermark} /> }
                        </ScrollView>) }
                </View>
            </View>
        );
    }

    getStyle(w, h) {
        //console.log('getStyle1', 'W', w, 'H', h);
        return EStyleSheet.create({
            layout: {
                flex: 1,
                display : 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                top: 0,
                height: '100%',
                paddingLeft: 8,
                paddingRight: 8,
            },
            title: {
                height: this.state.titleHeight
            },
            titleInput: {
                borderWidth: Common.borderWidth,
                borderColor: Common.input.borderColor,
                borderRadius: Common.borderRadiusBase,
                color: Common.color.textColor,
            },
            body: {
                display : 'flex',
                flex: 1,
                height: h,
                margin: 0,
                padding: 4,
            },
            watermark: {
                fontSize: 300,
                textAlign: 'center',
                textAlignVertical: 'center',
                color: "#E0E0E0",
                marginTop: 60,
            },
            noTextMsg: {
                margin: 0,
                width: '100%',
                textAlign: 'center',
                textAlignVertical: 'center',
                padding: 40,
            },
            tags: {
                height: this.state.tagHeight
            },
            mdBorder: {
                borderWidth: 1,
                borderColor: Common.input.borderColor,
            },
            previewStyle: {
                height: h-8,
                borderWidth: 1,
                borderColor: Common.input.borderColor,
            },
        });
    };
}

function mapStateToProps(state) {
    return {
        updateMemo: state.updateMemo,
        updateTag: state.updateTag,
        updateMemoTag: state.updateMemoTag,
        cursor: state.cursor,
        onEdit: state.onEdit,
        onDetail: state.onDetail,
    }
}

function mapDispatchToProps(dispatch, ownProps) {
    return {
        beginEdit: () => dispatch(Actions.beginEdit()),
        endEdit  : () => dispatch(Actions.endEdit()),
        endDetail  : () => dispatch(Actions.endDetail()),
        updateMemo  : () => dispatch(Actions.updateMemo()),
        updateMemoTag  : () => dispatch(Actions.updateMemoTag()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Detail);

