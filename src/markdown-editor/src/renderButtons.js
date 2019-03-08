import React from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import { Icon } from 'native-base';

import {
    applyWrapFormat, applyWrapFormatNewLines, applyWebLinkFormat, applyListFormat, applyImageLinkFormat, applyHrFormat
} from './utils';

const FOREGROUND_COLOR = 'rgba(82, 194, 175, 1)';
const iconStyle = {padding: 8, color: FOREGROUND_COLOR, minWidth: 40, height: 40, textAlign: 'center', marginLeft: 4};


const formats = [
    { key: 'IMG', iconName: 'image', iconType: 'MaterialCommunityIcons', onPress: applyImageLinkFormat },
    { key: 'B', iconName: 'format-bold', iconType: 'MaterialCommunityIcons', wrapper: '**',
        onPress: applyWrapFormat, style: { fontWeight: 'bold' } },
    { key: 'I', iconName: 'format-italic', iconType: 'MaterialCommunityIcons', wrapper: '*',
        onPress: applyWrapFormat, style: { fontStyle: 'italic' } },
    {
        key: 'U',
        iconName: 'format-underline', iconType: 'MaterialCommunityIcons',
        wrapper: '__',
        onPress: applyWrapFormat,
    },
    {
        key: 'S',
        iconName: 'format-strikethrough-variant', iconType: 'MaterialCommunityIcons',
        wrapper: '~~',
        onPress: applyWrapFormat,
    },
    { key: 'C', iconName: 'code-tags', wrapper: '`', iconType: 'MaterialCommunityIcons', onPress: applyWrapFormat },
    { key: 'CC', iconName: 'code-not-equal-variant', iconType: 'MaterialCommunityIcons', wrapper: '```',
        onPress: applyWrapFormatNewLines },
    { key: 'Q', iconName: 'format-indent-increase', prefix: '>', iconType: 'MaterialCommunityIcons', onPress: applyListFormat },
    { key: 'L', iconName: 'format-list-bulleted', iconType: 'MaterialCommunityIcons', prefix: '-', onPress: applyListFormat },
    { key: 'WEB', iconName: 'link', iconType: 'MaterialCommunityIcons', onPress: applyWebLinkFormat },
    { key: 'HR', iconName: 'window-minimize', wrapper: '___', iconType: 'MaterialCommunityIcons', onPress: applyHrFormat },

    { key: 'H1', iconName: 'format-header-1', iconType: 'MaterialCommunityIcons', prefix: '#', onPress: applyListFormat },
    { key: 'H2', iconName: 'format-header-2', iconType: 'MaterialCommunityIcons', prefix: '##', onPress: applyListFormat },
    { key: 'H3', iconName: 'format-header-3', iconType: 'MaterialCommunityIcons', prefix: '###', onPress: applyListFormat },
    { key: 'H4', iconName: 'format-header-4', iconType: 'MaterialCommunityIcons', prefix: '####', onPress: applyListFormat },
    { key: 'H5', iconName: 'format-header-5', iconType: 'MaterialCommunityIcons', prefix: '#####', onPress: applyListFormat },
    { key: 'H6', iconName: 'format-header-6', iconType: 'MaterialCommunityIcons', prefix: '######', onPress: applyListFormat },
];


const markdownButton = ({ item, getState, setState }) => {
    return (
        <TouchableOpacity onPress={() => item.onPress({ getState, setState, item })}>
            <Icon style={[iconStyle, item.style]} type={item.iconType} name={item.iconName}/>
        </TouchableOpacity>
    );
};

export const renderFormatButtons = ({ getState, setState }) => {
    return (
        <FlatList
            data={formats}
            keyboardShouldPersistTaps="always"
            renderItem={({ item, index }) => markdownButton({ item, getState, setState }) }
            horizontal
        />
    );
};
