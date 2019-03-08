'use strict';

import React from 'react';
import { withNavigationFocus } from 'react-navigation';
import Common from "../api/Common";
import Orientation from '../api/Orientation';
import { PhotoBrowser } from "../react-native-image-kit";
import PropTypes from "prop-types";


class ImageLib extends React.Component {

    static propTypes = {
        isFocused: PropTypes.bool,
    };

    static defaultProps = {
        isFocused: false,
    };

    static navigationOptions = {
        headerStyle: {
            display: 'none',
        },
    };

    constructor(props) {
        super(props);
        this.orientation = null;
        if(props.isFocused && Orientation.isFree()){
            this.orientation = Orientation.mode;
            Orientation.fix();
        }
    }

    _onClose = (pictureList) => {
        this.props.navigation.navigate('Home');
        pictureList.cleanup();
    };

    componentWillUpdate(nextProps, nextState, nextContext){
        if(this.props.isFocused === false && nextProps.isFocused && Orientation.isFree()){
            this.orientation = Orientation.mode;
            Orientation.fix();
        } else if(this.props.isFocused && nextProps.isFocused === false && this.orientation !== null){
            Orientation.mode = this.orientation;
            this.orientation = null;
        }
    }

    componentWillUnmount() {
        if(this.orientation !== null){
            Orientation.mode = this.orientation;
            this.orientation = null;
        }
    }

    render() {
        return (
            <PhotoBrowser pictureList={Common.pictureList}
                          isModal={false}
                          onClose={this._onClose}
                          show={this.props.isFocused}/>
        );
    }
}

export default withNavigationFocus(ImageLib);
