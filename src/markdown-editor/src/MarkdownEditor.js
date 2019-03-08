import React from 'react';
import { findNodeHandle, View, StyleSheet, TextInput, Platform, ScrollView, ViewPropTypes } from 'react-native';
import { Button, Icon } from 'native-base';
import PropTypes from "prop-types";
import Markdown from '../../markdown-view';//'react-native-markdown-renderer';

import { renderFormatButtons } from './renderButtons';

const FOREGROUND_COLOR = 'rgba(82, 194, 175, 1)';

export default class MarkdownEditor extends React.Component {

    static propTypes = {
        value: PropTypes.string,
        defaultValue: PropTypes.string,
        Formats: PropTypes.array,
        markdownButton: PropTypes.func,
        onMarkdownChange: PropTypes.func,
        onEndEditing: PropTypes.func,
        showPreview:  PropTypes.bool,
        keyboardAvoiding: PropTypes.bool,
        style: ViewPropTypes.style,
        borderStyle: ViewPropTypes.style,
        editorStyle: ViewPropTypes.style,
        previewStyle: ViewPropTypes.style,
        pictureManager: PropTypes.object,
        placeholder: PropTypes.string,
        placeholderTextColor: PropTypes.string,
    };

    static defaultProps = {
        value: '',
        defaultValue: '',
        style: {},
        borderStyle: {},
        editorStyle: {},
        previewStyle: {},
        showPreview: false,
        keyboardAvoiding: false,
        pictureManager: null,
        placeholder: 'Touch here and write a long markdown message',
        placeholderTextColor: '#909090',
    };

    constructor(props) {
        super(props);
        this.text = props.defaultValue;
        this.state = {
            dummy : null,
            selection: { start: 0, end: 0 },
            showPreview: props.showPreview,
            barHeight : 40,
            screenHeight : 0,
        };
        this.scrollPan = null;
        this.textInput = null;
        this.imageKit = props.pictureManager;
    }

    onEndEditing = (e) => {
        if (this.props.onEndEditing) this.props.onEndEditing(e);
    };

    onChangeText = (input) => {
        this.text = input;
        if (this.props.onMarkdownChange) this.props.onMarkdownChange(input);
    };

    onSelectionChange = event => {
        this.setState({
            selection: event.nativeEvent.selection,
        });
    };

    inputFocused = () => {
        if (Platform.OS === 'ios')
            setTimeout(() => {
                let scrollResponder = this.scrollPan.getScrollResponder();
                scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
                    findNodeHandle(this.textInput),
                    110, //additionalOffset
                    true
                );
            }, 50);
    };

    getState = () => {
        return Object.assign({}, this.state, {text: this.text, imageKit: this.imageKit});
    };

    convertMarkdown = () => {
        this.setState({
            showPreview: !this.state.showPreview
        });
    };

    renderPreview = (height) => {
        const { borderStyle, previewStyle } = this.props;
        return (
            <ScrollView removeClippedSubviews style={[styles.preview, borderStyle, {height: height}]}>
                <Markdown markdownStyles={markdownStyles}>
                    {this.text === '' ? 'Markdown preview here' : this.text}
                </Markdown>
            </ScrollView>
        );
    };

    render() {
        const { Formats, markdownButton, borderStyle, editorStyle, placeholder, placeholderTextColor } = this.props;
        const { selection, showPreview } = this.state;
        const editHeight = this.props.height - this.state.barHeight;

        return (
            <View style={[styles.screen, this.props.style]} >
                <TextInput
                    style={[styles.composeText, editorStyle, borderStyle, {height: (showPreview ? editHeight*2/3 : editHeight)}]}
                    multiline={true}
                    underlineColorAndroid="transparent"
                    onEndEditing={this.onEndEditing}
                    onChangeText={this.onChangeText}
                    onSelectionChange={this.onSelectionChange}
                    defaultValue={this.text}
                    placeholder={placeholder}
                    placeholderTextColor={placeholderTextColor}
                    ref={textInput => (this.textInput = textInput)}
                    selection={selection}
                />
                {showPreview ? this.renderPreview(editHeight/3) : null}
                <View style={[styles.buttonContainer, borderStyle]} >
                    <Button onPress={this.convertMarkdown} transparent
                            style={{ padding: 0, borderRightWidth: 1, borderColor: FOREGROUND_COLOR }}>
                        <Icon style={{color: FOREGROUND_COLOR}} type="MaterialCommunityIcons" name="eye" />
                    </Button>
                    {renderFormatButtons(
                        {
                            getState: this.getState,
                            setState: (state, callback) => {
                                this.textInput.focus();
                                if (state.hasOwnProperty('text')){
                                    this.onChangeText(state.text);
                                    delete state.text;
                                }
                                this.setState(state, callback);
                                this.onEndEditing();
                            },
                        },
                        Formats,
                        markdownButton,
                    )}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    composeText: {
        textAlignVertical: 'top',
        borderColor: FOREGROUND_COLOR,
        borderWidth: 1,
        paddingVertical: 4,
        paddingRight: 4,
        paddingLeft: 8,
        fontSize: 14,
    },
    buttonContainer: {
        flex: 0,
        flexDirection: 'row',
    },
    inlinePadding: {
        padding: 8,
    },
    preview: {
        paddingHorizontal: 5,
    },
    screen: {
        display : 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        backgroundColor: 'white',

    },
});

const markdownStyles = {
    heading1: {
        fontSize: 24,
        color: 'purple',
    },
    link: {
        color: 'pink',
    },
    mailTo: {
        color: 'orange',
    },
    text: {
        color: '#555555',
    },
};
