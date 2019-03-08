/**
 * @overview Definition of OverlayMenu component
 * for right side icon bar
 * This component was adapted from and inspired by @rt2zz's "React Native Drawer"
 * @see https://github.com/root-two/react-native-drawer
 *
 * last modified : 2019.01.28
 * @module components/OverlayMenu
 * @author Seungho.Yi <rh22sh@gmail.com>
 * @package react-native-image-kit
 * @license MIT
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Footer, FooterTab } from 'native-base';
import PropTypes from 'prop-types';
import Common from '../api/Common';

export default class Toolbar extends React.Component {
    static propTypes = {
        buttons: PropTypes.array.isRequired,
        styles: PropTypes.object,
    };

    static defaultProps = {
        styles: {}
    };

    constructor(props) {
        super(props);
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if(this.props.open !== nextProps.open){
            this.setState({open: nextProps.open});
        }
    }

    render() {
        let { buttons, vertical } = this.props;
        if (vertical){
            for(let btn of buttons){
                btn.transparent = true;
            }
            return (
                <View style={styles.vertical}>
                    {Common.buttonList(buttons, styles)}
                </View>
            );
        } else {
            for(let btn of buttons){
                btn.transparent = false;
            }
            return (
                <Footer >
                    <FooterTab>
                        {Common.buttonList(buttons)}
                    </FooterTab>
                </Footer>
            );
        }
    }
}

const styles = StyleSheet.create({
    button: {
        padding: 0,
        marginTop: 8,
    },
    icon: {
        color: Common.toolbar.btnColor
    },
    vertical: {
        width: 55,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: Common.footer.defaultBg,
        borderLeftWidth: Common.borderWidth,
        borderLeftColor: Common.toolbar.defaultBorder,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    absolute: {
        position: "absolute",
        top: 0,
        bottom: 0,
        right: 0,
        width:60,
    },
    closeButton: {
        borderBottomWidth: 1,
        borderBottomColor: '#A0A0A0',
    },
});
