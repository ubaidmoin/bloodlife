import React, { Component } from 'react';
import { Text, View, StyleSheet, Image, FlatList, TouchableOpacity, BackHandler, Dimensions } from 'react-native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import { TextInput } from 'react-native-paper';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { AndroidBackHandler } from "react-navigation-backhandler";

import ReceiversScreen from './Receivers';

const Tab = createMaterialTopTabNavigator();

class Donors extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            donors: [],
            searchDonors: [],
            filter: ''
        };
    }

    onBackButtonPressAndroid = () => {
        BackHandler.exitApp();
        return true;
    };

    componentDidMount() {
        this.getDonors();
    }

    filterData(data, text) {
        const filteredData = data.filter(item => {
            const itemData = `${item.firstName.toUpperCase()}`;
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });
        return filteredData;
    }

    filterDataBloodGroup(data, text) {
        const filteredData = data.filter(item => {
            const itemData = `${item.bloodGroup.toUpperCase()}`;
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });
        return filteredData;
    }

    filterDataId(data, text) {
        const filteredData = data.filter(item => {
            const itemData = `${item.id.toUpperCase()}`;
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });
        return filteredData;
    }

    filterContacts(text) {
        if (text.endsWith('+') || text.endsWith('-')) {
            const filteredData = this.filterDataBloodGroup(this.state.searchDonors, text)
            this.setState({
                filter: text,
                donors: filteredData
            });
        } else if (text.startsWith('BL')) {
            const filteredData = this.filterDataId(this.state.searchDonors, text)
            this.setState({
                filter: text,
                donors: filteredData
            });
        } else {
            const filteredData = this.filterData(this.state.searchDonors, text)
            this.setState({
                filter: text,
                donors: filteredData
            });
        }
    }

    getDonors() {
        firestore().collection('Users').onSnapshot(snapshot => {
            let donors = [];
            snapshot.forEach(user => {
                if (user.data().userType === 'donor')
                    donors.push({
                        id: user.id,
                        firstName: user.data().firstName,
                        lastName: user.data().lastName,
                        email: user.data().email,
                        password: user.data().password,
                        phoneNo: user.data().phoneNo,
                        userType: user.data().userType,
                        ratings: user.data().ratings,
                        dob: user.data().dob,
                        address: user.data().address,
                        image: user.data().image,
                        weight: user.data().weight,
                        lastDonated: user.data().lastDonated,
                        bloodGroup: user.data().bloodGroup,
                        disease: user.data().disease,
                        blocked: user.data().blocked
                    });
            });
            this.setState({
                donors: donors,
                searchDonors: donors
            })
        });
    }

    showDescription(index) {
        let data = [...this.state.donors]
        let item = data[index]
        item.showDescription = !item.showDescription
        data.forEach(element => {
            if (element.id !== item.id) {
                element.showDescription = false
            }
        })
        this.setState({ donors: data })
    }

    blockUser(index) {
        let data = [...this.state.donors];
        let item = data[index];
        firestore().collection('Users').doc(item.id)
            .get()
            .then((querySnapshot) => {
                firestore().collection('Users').doc(querySnapshot.data().id).update({
                    blocked: (item.blocked) ? false : true
                }).then(() => {
                    alert((item.blocked) ? 'User unblocked.' : 'User blocked.');
                    this.getDonors()
                })
            })
    }

    removeDonor(index) {
        let data = [...this.state.donors];
        let item = data[index];
        auth().signInWithEmailAndPassword(item.email, item.password)
            .then((doc) => doc.user.delete().then(() => {
                console.log('deleted')
                firestore().collection('Users').doc(item.id)
                    .delete().then(() => alert('Donor removed.'))
            }))
    }

    renderDonors() {
        const { image, title, historyTitleContainer, list, type, typeContainer, blockButtonStyle, blockedTextStyle } = styles;
        return (
            <FlatList
                data={this.state.donors}
                keyExtractor={item => item.id + ''}
                renderItem={({ item, index }) => (
                    <View key={index}>
                        <View style={list}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Image source={(item.image === '') ?
                                    require('../../assets/img/user.jpg') :
                                    { uri: 'data:image/jpeg;base64,' + item.image }} style={image} />
                                <View style={{ marginLeft: 5 }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 12 }}>{item.id}</Text>
                                    <Text style={title}>{item.firstName + ' ' + item.lastName}</Text>
                                    <View style={styles.ratings}>
                                        <Text style={styles.textStyle}>{item.ratings}</Text>
                                        <FontAwesomeIcon
                                            name="star"
                                            size={15}
                                            color={"#000"}
                                        />
                                    </View>
                                </View>
                            </View>
                            <View style={{ position: 'absolute', right: 20, top: 45 }}>
                                <TouchableOpacity
                                    onPress={() => this.showDescription(index)}
                                    style={{ justifyContent: 'center', alignItems: 'center' }}
                                >
                                    <AntDesignIcon
                                        name={(item.showDescription !== true) ? "downcircle" : "upcircle"}
                                        size={20}
                                        color="black"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {(item.showDescription === true) ?
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: Dimensions.get('screen').width * .05, paddingBottom: 10, marginTop: -15, backgroundColor: 'white', borderRadius: 5 }}>
                                <View style={{ width: '100%' }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingHorizontal: 20 }}>
                                        <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Blood Group:</Text>
                                        <Text style={{ fontSize: 15 }}>{item.bloodGroup}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingHorizontal: 20 }}>
                                        <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Weight:</Text>
                                        <Text style={{ fontSize: 15 }}>{item.weight}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingHorizontal: 20 }}>
                                        <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Last Donated:</Text>
                                        <Text style={{ fontSize: 15 }}>{item.lastDonated}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingHorizontal: 20 }}>
                                        <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Phone Number:</Text>
                                        <Text style={{ fontSize: 15 }}>{item.phoneNo}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingHorizontal: 20 }}>
                                        <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Have Disease:</Text>
                                        <Text style={{ fontSize: 15 }}>{item.disease}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                                        <TouchableOpacity
                                            style={blockButtonStyle}
                                            onPress={() => this.blockUser(index)}
                                        >
                                            <Text style={blockedTextStyle}>
                                                {(item.blocked) ? 'unblock'.toUpperCase() : 'block'.toUpperCase()}
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={blockButtonStyle}
                                            onPress={() => this.removeDonor(index)}
                                        >
                                            <Text style={blockedTextStyle}>
                                                {'Remove'.toUpperCase()}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View> :
                            null
                        }
                    </View>
                )}
            />
        )
    }

    addDonor() {
        this.props.navigation.navigate('AddDonor');
    }

    render() {
        const { search, blockButtonStyle, blockedTextStyle } = styles;
        return (
            <AndroidBackHandler onBackPress={this.onBackButtonPressAndroid}>
            <View style={{ width: '100%', height: '100%', backgroundColor: '#EBEFF3' }}>
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
                    <View style={{ alignItems: 'flex-end' }}>
                        <TouchableOpacity
                            style={blockButtonStyle}
                            onPress={() => this.addDonor()}
                        >
                            <Text style={blockedTextStyle}>
                                {'add donor'.toUpperCase()}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View>
                    {this.renderDonors()}
                </View>
            </View>
            </AndroidBackHandler>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: "100%"
    },
    inputContainer: {
        borderBottomColor: '#F5FCFF',
        backgroundColor: 'lightgrey',
        borderRadius: 30,
        borderBottomWidth: 1,
        width: '80%',
        height: 45,
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    inputs: {
        height: 45,
        marginLeft: 16,
        borderBottomColor: '#FFFFFF',
        flex: 1,
    },
    buttonContainer: {
        marginTop: 30,
        marginBottom: 5,
        marginLeft: 15,
        height: 25,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '60%',
        borderRadius: 30,
    },
    buttonStyle: {
        flex: 1,
        alignSelf: 'stretch',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E0E1E1',
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#E0E1E1',
        marginRight: 10
    },
    list: {
        width: Dimensions.get('screen').width * .9,
        padding: 10,
        marginVertical: 10,
        marginHorizontal: Dimensions.get('screen').width * .05,
        backgroundColor: '#fff',
        elevation: 1000,
        borderRadius: 5
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 40
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
    },
    ratings: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    textStyle: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    blockButtonStyle: {
        backgroundColor: '#ff5d5b',
        height: 25,
        paddingHorizontal: 20,        
        borderWidth: 1,
        borderColor: '#fea39e',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        marginVertical: 5
    },
    blockedTextStyle: {
        color: 'white'
    },
    search: {
        width: Dimensions.get('screen').width,
        paddingHorizontal: Dimensions.get('screen').width * .05,
        paddingVertical: 10
    }
});

function MyTabs() {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Donors" component={Donors} />
            <Tab.Screen name="Receivers" component={ReceiversScreen} />
        </Tab.Navigator>
    );
}

export default MyTabs;