import React, { Component } from 'react';
import { View, Text, Dimensions, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Communications from 'react-native-communications';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { TextInput } from 'react-native-paper';
import { connect } from 'react-redux';

import * as userDetailsAction from '../../actions/UserDetailsAction';

class Contacts extends Component {

    constructor(props) {
        super(props);
        this.state = {
            emergencyContacts: [
                {
                    id: 1,
                    name: 'Police',
                    phoneNo: '15'
                },
                {
                    id: 2,
                    name: 'Rescue',
                    phoneNo: '1122'
                }
            ],
            searchEmergencyContacts: [
                {
                    id: 1,
                    name: 'Police',
                    phoneNo: '15'
                },
                {
                    id: 2,
                    name: 'Rescue',
                    phoneNo: '1122'
                }
            ],
            filter: ''
        };
    }

    filterData(data, text) {
        const filteredData = data.filter(item => {
            const itemData = `${item.name.toUpperCase()}`;
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });
        return filteredData;
    }

    filterContacts(text) {
        const filteredData = this.filterData(this.state.searchEmergencyContacts, text)
        this.setState({
            search: text,
            emergencyContacts: filteredData
        });
    }

    renderContacts(item, index) {
        const { title, phoneNo, historyTitleContainer, list } = styles;
        return (
            <View style={list}>
                <View style={historyTitleContainer}>
                    <View>
                        <Text style={title}>{item.name}</Text>
                        <Text style={phoneNo}>Contact Number: {item.phoneNo}</Text>
                    </View>
                    <TouchableOpacity onPress={() => Communications.phonecall(item.phoneNo, true)}>
                        <FontAwesomeIcon
                            name="phone"
                            size={30}
                            color="#ff5d5b"
                        />
                        <Text style={phoneNo}>
                            Dial
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    render() {
        const { container, search } = styles;
        const { emergencyContacts } = this.state;
        return (
            <View style={container}>
                <View style={search}>
                    <TextInput
                        label='Search'
                        mode='outlined'
                        style={{
                            height: 40,
                            width: '100%',
                        }}
                        theme={{
                            colors: { primary: '#ff5d5b', underlineColor: 'black' }
                        }}
                        selectionColor='#ff5d5b'
                        underlineColor='#ff5d5b'
                        value={this.state.filter}
                        onChangeText={filter => this.filterContacts(filter)}
                    />
                </View>
                <FlatList
                    data={emergencyContacts}
                    keyExtractor={contact => contact.id + contact.name}
                    renderItem={({ item, index }) => this.renderContacts(item, index)}
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
    search: {
        width: Dimensions.get('screen').width,
        paddingHorizontal: Dimensions.get('screen').width * .05,
        paddingVertical: 10
    },
    list: {
        width: Dimensions.get('screen').width * .9,
        padding: 10,
        marginVertical: 10,
        marginHorizontal: Dimensions.get('screen').width * .05,
        backgroundColor: '#fff',
        elevation: 1000,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ff5d5b'
    },
    historyTitleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 5
    },
    phoneNo: {
        fontSize: 15,
        color: '#ff5d5b'
    },
    phoneContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    }
})

export default connect(userDetailsAction.mapStateToProps, userDetailsAction.mapDispatchToProps)(Contacts);