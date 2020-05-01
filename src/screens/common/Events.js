import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image, Dimensions } from 'react-native';
import { connect } from 'react-redux';

import * as userDetailsAction from '../../actions/UserDetailsAction';

class Event extends Component {

    constructor(props) {
        super(props);
        this.state = {
            events: [
                { id: 1, name: 'Blood Life', date: new Date().toDateString() },
                { id: 2, name: 'Blood Life', date: new Date().toDateString() }
            ]
        };
    }

    onShowMore () {

    }

    renderEvents(item, index) {
        const { event, image, eventTitle, eventName, eventDate, buttonStyle, textStyle } = styles;
        return (
            <View style={event} key={index}>
                <Image source={require("../../assets/img/logo.jpeg")} style={image} />
                <View style={eventTitle}>
                    <View>
                        <Text style={eventName}>{item.name}</Text>
                        <Text style={eventDate}>{item.date}</Text>
                    </View>
                    <TouchableOpacity
                        style={buttonStyle}
                        onPress={() => this.onShowMore()}
                    >
                        <Text style={textStyle}>
                            {'show more'.toUpperCase()}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    render() {
        const { container } = styles;
        const { events } = this.state;
        return (
            <View style={container}>
                <FlatList
                    data={events}
                    keyExtractor={event => event.id + event.name}
                    renderItem={({ item, index }) => this.renderEvents(item, index)}
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
    event: {
        width: Dimensions.get('screen').width * .9,
        marginHorizontal: Dimensions.get('screen').width * .05,
        marginVertical: 10,
        elevation: 1000,
        backgroundColor: '#ffffff',
        padding: 10
    },
    image: {
        width: '100%',
        height: 100
    },
    eventTitle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10
    },
    eventName: {
        fontWeight: 'bold',
        fontSize: 25
    },
    eventDate: {
        fontSize: 15
    },
    buttonStyle: {
        backgroundColor: '#ff5d5b',
        height: 25,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#fea39e',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5
    },
    textStyle: {
        color: 'white'
    }
})

export default connect(userDetailsAction.mapStateToProps, userDetailsAction.mapDispatchToProps)(Event);