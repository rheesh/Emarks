import React from 'react';
import { View, Dimensions, StatusBar, StyleSheet, Alert } from 'react-native';
import { Container, Button, Icon, Header, Title, Left, Right, Body } from 'native-base';
import connect from "react-redux/es/connect/connect";
import Common from "../api/Common";
import DB from "../api/DB";
import KeyboardSpacer from '../components/KeyboardSpacer';
import SearchItem from "../components/SearchItem";
import ItemList from "../components/ItemList";
import Detail from '../components/Detail';
import Toolbar from '../components/Toolbar';
import Logo from '../components/Logo';
import * as Actions from "../actions";
import Orientation from "../api/Orientation"


class Main extends React.Component {
    static navigationOptions = {
        headerStyle: {
            display: 'none',
        },
    };

    constructor(props) {
        super(props);
        const {width, height} = Dimensions.get('window');
        this.itemList = null;
        this.state = {
            width : width,
            height: height,
            kbdHeight : 0,
            onEdit: false,
            menuShow: true,
            headerHeight : 64,
            listHeight: 256,
            searchHeight : 96,
        };
        this.onLayout = this.onLayout.bind(this);
        this.onHeaderLayout = this.onHeaderLayout.bind(this);
        this.onListLayout = this.onListLayout.bind(this);
        this.onSearchLayout = this.onSearchLayout.bind(this);
        this.onKeyboardToggle = this.onKeyboardToggle.bind(this);
        this.create = this.create.bind(this);
        this.props.endDetail();
    }

    onKeyboardToggle(kbdState, kbdHeight){
        if (kbdState) {
            if (this.state.kbdHeight !== kbdHeight){
                this.setState({ kbdHeight: kbdHeight });
            }
        } else {
            if (this.state.kbdHeight > 0){
                this.setState({ kbdHeight: 0 });
            }
        }
    }

    onLayout(e) {
        const {width, height} = Dimensions.get('window');
        if (this.state.width !== width || this.state.height !== height){
            this.setState({
                width : width,
                height: height,
            });
        }
    }

    onHeaderLayout(e) {
        const height = e.nativeEvent.layout.height;
        if (this.state.headerHeight !== height ){
            this.setState({headerHeight : height})
        }
    }

    onListLayout(e) {
        const {width, height} = e.nativeEvent.layout;
        if (this.state.listHeight !== height ){
            this.setState({listHeight : height})
        }
    }

    onSearchLayout(e) {
        const height = e.nativeEvent.layout.height;
        //console.log('onSearchLayout',e.nativeEvent.layout);
        if (this.state.searchHeight !== height ){
            this.setState({searchHeight : height})
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if ( nextState.width < 481 || nextState.height < 481){
            if ( nextProps.onEdit ){
                if( ! Orientation.isPortrait())
                    Orientation.portrait();
            } else {
                if( ! Orientation.isFree())
                    Orientation.free();
            }
        }
        return true;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { onDetail, onEdit } = this.props;
        if( this.state.width < 481 && (onDetail || onEdit) )
            this.itemList = null;
    }

    async create(){
        if(this.itemList)
            this.itemList.getWrappedInstance().closeRow();
        const memo = await DB.memos.add("No Title", "");
        this.props.beginEdit(memo.id);
    }

    endEdit() {
        if (this.props.onEdit)
            this.props.endEdit();
    }

    _removeSelected() {
        let memo = DB.memos.current;
        let itemList = this.itemList;
        let { onDetail, endDetail, setCursor } = this.props;
        Alert.alert(
            'Confirm',
            `Are you sure you want to delete the "${memo.title}" memo?`,
            [
                { text: 'Cancel', onPress: () => null, style: 'cancel'},
                {
                    text: 'OK',
                    onPress: () => {
                        if(itemList){
                            itemList.getWrappedInstance().removeSelected();
                        }else{
                            DB.removeMemo(memo);
                            if(onDetail) endDetail();
                            else setCursor();
                        }
                    }
                },
            ]
        );
    }

    _renderSidePan(styles) {
        const { onDetail } = this.props;
        const { width } = this.state;
        const height = this.state.listHeight - this.state.searchHeight;
        if(onDetail && width < 481){
            this.itemList = null;
            return null;
        } else
            return (
                <View style={styles.sidePan} onLayout={this.onListLayout}>
                    <SearchItem onLayout={this.onSearchLayout}/>
                    <ItemList height={height} ref={ref => this.itemList = ref}/>
                </View>
            );
    }

    _renderToolbar(direction='horizontal'){
        const { kbdHeight, width, height } = this.state;
        if(direction === 'vertical'){
            if(width > height){
                return (
                    <Toolbar vertical buttons={this.headerBtn}/>
                );
            }else{
                return null;
            }
        }else{
            if(width > height || kbdHeight > 0){
                return null;
            }else{
                return (
                    <Toolbar buttons={this.headerBtn}/>
                );
            }
        }
    }

    _renderContentPan(styles, contentHeight){
        const { onDetail } = this.props;
        const { width } = this.state;
        if(onDetail || width > 480)
            return (
                <View style={styles.contentsPan}>
                    <Detail height={contentHeight}/>
                </View>
            );
        else return null;
    }

    get headerBtn() {
        const { width } = this.state;
        const { onDetail, onEdit } = this.props;
        let buttons = [
            {
                callback: () => this.props.navigation.navigate('Images'),
                icon: {
                    name: 'folder-image',
                    type: 'MaterialCommunityIcons',
                }
            },
            {
                callback: () => this.props.navigation.navigate('Settings'),
                icon: {
                    name: 'settings-outline',
                    type: 'MaterialCommunityIcons',
                }
            },
        ];
        if(width > 480 || onDetail){
            buttons.unshift({
                callback: () => this._removeSelected(),
                icon: {
                    name: 'delete',
                    type: 'MaterialCommunityIcons',
                }
            });
            if (onEdit){
                buttons.unshift({
                    callback: () => this.props.endEdit(),
                    icon: {
                        name: 'pencil-off',
                        type: 'MaterialCommunityIcons',
                    }
                });
            }else{
                buttons.unshift({
                    callback: () => this.props.beginEdit(),
                    icon: {
                        name: 'lead-pencil',
                        type: 'MaterialCommunityIcons',
                    }
                });
            }
        }
        if(! onEdit){
            buttons.unshift({
                callback: () => this.create(),
                icon: {
                    name: 'plus',
                    type: 'MaterialCommunityIcons',
                }
            });
        }
        return buttons;
    }

    render() {
        let contentHeight = this.state.height - this.state.headerHeight - this.state.kbdHeight;
        const { onDetail, onEdit } = this.props;
        const { width, height } = this.state;
        if (width < height && this.state.kbdHeight === 0) contentHeight -= Common.footer.height;
        const styles = this.getStyle(width, contentHeight);
        return (
            <Container onLayout={this.onLayout}>
                <Header  onLayout={this.onHeaderLayout} style={styles.header}>
                    <StatusBar translucent={false} animated />
                    <Left style={{flex: 1}}>
                        { onDetail && width < 481 ?
                            <Button transparent onPress={() => { this.props.endDetail(); } } >
                                <Icon  name="chevron-left" type="MaterialCommunityIcons" />
                            </Button>
                            : null
                        }
                    </Left>
                    <Body style={{flex: 1}}>
                        <Button iconLeft transparent >
                            <Logo />
                            <Title style={styles.titleText} >{" Notes"}</Title>
                        </Button>
                    </Body>
                    <Right style={{flex: 1}}>
                        { true ? null :
                            <Button transparent onPress={() => null }>
                                <Icon  name="help" type="MaterialCommunityIcons" style={{fontSize: 22}}/>
                            </Button>
                        }
                    </Right>
                </Header>
                <View style={styles.content}>
                        <View style={styles.layout}>
                            {this._renderSidePan(styles, contentHeight)}
                            {this._renderContentPan(styles, contentHeight)}
                            {this._renderToolbar('vertical')}
                        </View>
                </View>
                {this._renderToolbar()}
                <KeyboardSpacer onToggle={this.onKeyboardToggle}/>
            </Container>
        );
    }

    getStyle(w, h) {
        let css = {
            titleText: {
                color: Common.toolbar.btnTextColor,
                marginLeft: 0,
                paddingLeft: 0,
            },
            content: {
                height: h,
                width: w,
            },
            header: {
                height: Common.header.height,
                paddingTop: Common.header.padding,
            },
            layout: {
                display : 'flex',
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'flex-start',
                height: h,
            },
            contentsPan: {
                display : 'flex',
                flex: 1,
                flexDirection: 'column',
            },
            sidePan: {
                width: w > 640 ? 320 : w > 480 ? 240 : w,
                display : 'flex',
                flexDirection: 'column',
                borderRightWidth: 1,
                borderRightColor: Common.input.borderColor,
            }
        };
        return StyleSheet.create(css);
    }
}

function mapStateToProps(state) {
    return {
        onEdit    : state.onEdit,
        onDetail  : state.onDetail,
        searchKey : state.searchKey,
        searchTags: state.searchTags,
    }
}

function mapDispatchToProps(dispatch, ownProps) {
    return {
        beginEdit: (id) => dispatch(Actions.beginEdit(id)),
        endDetail: () => dispatch(Actions.endDetail()),
        endEdit  : () => dispatch(Actions.endEdit()),
        setCursor: (id) => dispatch(Actions.setCursor(id)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);
