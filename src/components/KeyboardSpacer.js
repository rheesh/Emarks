/**
 * @overview Definition of KeyboardSpacer component
 * This source was adapted from and inspired by Andrew Hurst's "react-native-keyboard-spacer".
 * @see https://github.com/Andr3wHur5t/react-native-keyboard-spacer
 *
 * last modified : 2019.03.02
 * @module components/KeyboardSpacer
 * @author Seungho.Yi <rh22sh@gmail.com>
 * @package Emarks
 * @license MIT
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Keyboard, LayoutAnimation, View, ViewPropTypes, Platform, StyleSheet, Dimensions } from 'react-native';

const styles = StyleSheet.create({
  container: {
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'blue',
  },
});

// From: https://medium.com/man-moon/writing-modern-react-native-ui-e317ff956f02
const defaultAnimation = {
  duration: 500,
  create: {
    duration: 300,
    type: LayoutAnimation.Types.easeInEaseOut,
    property: LayoutAnimation.Properties.opacity
  },
  update: {
    type: LayoutAnimation.Types.spring,
    springDamping: 200
  }
};

export default class KeyboardSpacer extends Component {
  static propTypes = {
    topSpacing: PropTypes.number,
    onToggle: PropTypes.func,
    style: ViewPropTypes.style,
  };

  static defaultProps = {
    topSpacing: 0,
    onToggle: () => null,
  };

  constructor(props) {
    super(props);
    this.state = {
      keyboardSpace: 0,
      isKeyboardOpened: false
    };
    this._listeners = null;
    this.updateKeyboardSpace = this.updateKeyboardSpace.bind(this);
    this.resetKeyboardSpace = this.resetKeyboardSpace.bind(this);
  }

  componentDidMount() {
    const updateListener = Platform.OS === 'android' ? 'keyboardDidShow' : 'keyboardWillShow';
    const resetListener = Platform.OS === 'android' ? 'keyboardDidHide' : 'keyboardWillHide';
    this._listeners = [
      Keyboard.addListener(updateListener, this.updateKeyboardSpace),
      Keyboard.addListener(resetListener, this.resetKeyboardSpace)
    ];
  }

  componentWillUnmount() {
    this._listeners.forEach(listener => listener.remove());
  }

  updateKeyboardSpace(event) {
    if (!event.endCoordinates) {
      return;
    }
    let animationConfig = defaultAnimation;
    LayoutAnimation.configureNext(animationConfig);

    const {height} = Dimensions.get('window');
    const keyboardSpace = Platform.OS === 'android' ?
                          Math.abs(height - event.endCoordinates.screenY) :
                          Math.abs(event.startCoordinates.screenY - event.endCoordinates.screenY);
    this.setState({
      keyboardSpace,
      isKeyboardOpened: true
    }, this.props.onToggle(true, keyboardSpace));
  }

  resetKeyboardSpace(event) {
    let animationConfig = defaultAnimation;

    LayoutAnimation.configureNext(animationConfig);

    this.setState({
      keyboardSpace: 0,
      isKeyboardOpened: false
    }, this.props.onToggle(false, 0));
  }

  render() {
    return (
        <View style={[styles.container, { height: 0 }, this.props.style]} />);
  }
}
