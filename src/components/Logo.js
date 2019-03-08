'use strict';

import React from 'react';
import { Dimensions, Image, StyleSheet, View, ActivityIndicator, Platform, } from 'react-native';
import Common from "../api/Common";
import PropTypes from "prop-types";

const logo = '../../assets/icon.128x128.png';

export default class Logo extends React.Component {

    static propTypes = {
        size: PropTypes.number,
    };

    static defaultProps = {
        size: 32,
    };

    constructor(props) {
        super(props);
    }

    render() {
        const size = this.props.size;
        return (
            <Image
                style={{width: size, height: size}}
                resizeMode={'contain'}
                source={require(logo)}/>
        );
    }
}
