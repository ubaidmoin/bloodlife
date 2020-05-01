import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, FlatList, Dimensions, } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { connect } from 'react-redux';

import * as userDetailsAction from '../../actions/UserDetailsAction';

class History extends Component {

    constructor(props){
        super(props);
        this.state = {
            history: [
                { 
                    id: 1,
                    name: 'John',
                    type: 'B+',
                    date: new Date().toDateString()
                },
                { 
                    id: 2,
                    name: 'Emma',
                    type: 'O+',
                    date: new Date().toDateString()
                },
                { 
                    id: 3,
                    name: 'Ron',
                    type: 'B+',
                    date: new Date().toDateString()
                },
                { 
                    id: 4,
                    name: 'Adam',
                    type: 'B+',
                    date: new Date().toDateString()
                }
            ]
        };
    }

    renderHistory(item, index) {
        const { image, title, historyTitleContainer, list, type, typeContainer } = styles;
        return (
            <View style={list}>
                <Image source={require("../../assets/img/user.jpg")} style={image} />
                <View>
                    <View style={historyTitleContainer}>
                        <Text style={title}>{item.name}</Text>
                        <Text style={title}>{item.date}</Text>                        
                    </View>
                    <View style={typeContainer}>                        
                    <Text style={type}>Blood Group: {item.type}</Text>
                    </View>
                    {/* <TouchableOpacity
                        style={buttonStyle}
                        onPress={() => this.onShowMore()}
                    >
                        <Text style={textStyle}>
                            {'show more'.toUpperCase()}
                        </Text>
                    </TouchableOpacity> */}
                </View>
            </View>
        );
    }

    render() {
        const { container } = styles;
        const { history } = this.state;
        return (
            <View style={container}>
                <FlatList
                data={history}
                keyExtractor={history => history.id + history.name}
                renderItem={({ item, index }) => this.renderHistory(item, index)}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    list: {
        width: Dimensions.get('screen').width * .9,
        padding: 10,
        marginVertical: 10,
        marginHorizontal: Dimensions.get('screen').width * .05,
        backgroundColor: '#fff',
        elevation: 1000,
    },
    image: {
        width: '100%',
        height: 130,             
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    historyTitleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 5
    },
    type: {
        fontSize: 15
    },
    typeContainer: {
        paddingHorizontal: 5
    }
})

export default connect(userDetailsAction.mapStateToProps, userDetailsAction.mapDispatchToProps)(History);