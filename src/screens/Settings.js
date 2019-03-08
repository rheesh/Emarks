import React from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import { connect } from 'react-redux';
import {Container, Content, Text, List, ListItem, Left, Right, Button, Icon, Body, Title, Header} from 'native-base';
import Common from "../api/Common";
import * as Actions from '../actions';
import Logo from '../components/Logo';
/*
const dataArray = [
    {
        title: "Release Information",
        content: "Markdown Notes\n First release : 2019.02.13 \n Current release : V1.05, 2019.02.19",
    }
];
*/
class Settings extends React.Component {
    static navigationOptions = {
        headerStyle: {
            display: 'none',
        },
    };

    constructor(props) {
        super(props);
        this.doInit = this.doInit.bind(this);
    }

    render() {
        return (
            <Container>
                <Header style={styles.header}>
                    <StatusBar translucent={false} animated />
                    <Left style={{flex: 1}}>
                        <Button transparent onPress={() => this.props.navigation.navigate('Home')} >
                            <Icon  name="chevron-left" type="MaterialCommunityIcons" />
                        </Button>
                    </Left>
                    <Body style={{flex: 1}}>
                        <Button iconLeft transparent >
                            <Logo />
                            <Title style={styles.titleText} >{" Settings"}</Title>
                        </Button>
                    </Body>
                    <Right style={{flex: 1}}>
                        <Text>{' '}</Text>
                    </Right>
                </Header>
                <Content padder>
                    <List>
                        <ListItem>
                            <Left><Text style={styles.title}>Clear all data</Text></Left>
                            <Right><Button light onPress={this.doInit}><Icon type={'MaterialCommunityIcons'} name="bomb"/></Button></Right>
                        </ListItem>
                        <ListItem>
                            <Text style={styles.release}>
                                <Text style={styles.title}>{"Release Information\n"}</Text>
                                <Text style={{fontWeight: 'normal'}}>
                                    {"e-Marks \nBuild Number : 4 \nCurrent Version : V1.08, 2019.03.06"}
                                </Text>
                            </Text>
                        </ListItem>
                    </List>
                </Content>
            </Container>
        );
    }

    doInit() {
        this.props.clearDB();
    }
}

const styles = StyleSheet.create({
    title: {
        fontWeight: 'bold'
    },
    release: {
        display : 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
    },
    titleText: {
        color: Common.toolbar.btnTextColor,
        marginLeft: 0,
        paddingLeft: 0,
    },
    header: {
        height: Common.header.height,
        paddingTop: Common.header.padding,
    },
});

function mapStateToProps(state) {
    return {
        updateMemo: state.updateMemo
    }
}

function mapDispatchToProps(dispatch, ownProps) {
    return {
        clearDB : () => dispatch(Actions.clearDB()),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Settings);
