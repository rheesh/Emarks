import React from 'react';
import { NativeModules, Alert } from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { Permissions } from 'expo';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import EStyleSheet from 'react-native-extended-stylesheet';
import reducer from './src/reducers';
import Main from './src/screens/Main';
import Settings from './src/screens/Settings';
import ImageLib from './src/screens/ImageLib';
import AppFontLoader from "./src/components/AppFontLoader";
import * as Actions from './src/actions';
import Orientation from "./src/api/Orientation";

const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

EStyleSheet.build({ });


const RootStack = createStackNavigator(
    {
        Home: {
            screen: Main
        },
        Images: {
            screen: ImageLib
        },
        Settings: {
            screen: Settings
        },
    }, {
        initialRouteName: 'Home',
    }
);

const AppNavigator = createAppContainer(RootStack);

let store = createStore(reducer, applyMiddleware( thunk ));
store.dispatch(Actions.initDB());

export default class App extends React.Component {

    constructor(props) {
        super(props);
        Orientation.free();
    }

    async componentDidMount() {
        const results = await Promise.all([
            Permissions.askAsync(Permissions.CAMERA),
            Permissions.askAsync(Permissions.CAMERA_ROLL),
        ]);
        if (results.some(({status}) => status !== 'granted')) {
            Alert.alert('Camera roll', 'Can not use camera roll!!')
        }
    }

    render() {
        return (
            <AppFontLoader>
                <Provider store={store}>
                    <AppNavigator/>
                </Provider>
            </AppFontLoader>
        );
    }
}


