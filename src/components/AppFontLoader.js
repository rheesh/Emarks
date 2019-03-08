import React from 'react';
import { AppLoading, Font } from 'expo';

class AppFontLoader extends React.Component {

    state = { fontLoaded: false };

    async componentWillMount() {
        try {
            await Font.loadAsync({
                FontAwesome : require('../../node_modules/native-base/Fonts/FontAwesome.ttf'),
                MaterialIcons : require('../../node_modules/native-base/Fonts/MaterialIcons.ttf'),
                MaterialCommunityIcons : require('../../node_modules/native-base/Fonts/MaterialCommunityIcons.ttf'),
                Ionicons : require('../../node_modules/native-base/Fonts/Ionicons.ttf'),
                Roboto : require('../../node_modules/native-base/Fonts/Roboto.ttf'),
                Roboto_medium : require('../../node_modules/native-base/Fonts/Roboto_medium.ttf'),
            });
            this.setState({ fontLoaded: true });
        } catch (error) {
            console.log('in AppFontLoader.componentWillMount', error);
        }
    }

    render() {
        if (this.state.fontLoaded) {
            return this.props.children;
        } else {
            return <AppLoading />;
        }
    }
}




export default AppFontLoader;