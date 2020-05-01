import React, { Component } from 'react';
import { View, Text, StyleSheet, StatusBar, Dimensions, Image, TouchableOpacity, BackHandler, Switch, AsyncStorage, PermissionsAndroid } from 'react-native';
import { Button } from 'react-native-paper';
import MapView, { Marker, AnimatedRegion } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import FeatherIcon from 'react-native-vector-icons/Feather';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import { connect } from 'react-redux';
import PolylineDirection from '@react-native-maps/polyline-direction';
import Modal from 'react-native-modal';
import Communications from 'react-native-communications';

import * as userDetailsAction from '../../actions/UserDetailsAction';

class DriverHome extends Component {

    constructor(props) {
        super(props);
        this.state = {
            rdbOptions: [
                { label: "No", value: "0" },
                { label: "Yes", value: "1" }
            ],
            region: {
                latitude: 33.5651,
                longitude: 73.0169,
                latitudeDelta: 0.5,
                longitudeDelta: 0.5
            },
            selectedOption: false,
            receiver: {
                id: 1,
                firstName: 'Awais',
                lastName: 'Khan',
                ratings: 4.5,
                phoneNo: '0234234234',
                rLatitude: 33.5969,
                rLongitude: 73.0528,
            },
            accepted: false,
            modal: false
        };
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }

    async componentDidMount() {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: "Location Permission",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK"
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                Geolocation.getCurrentPosition((position) => {
                    var lat = parseFloat(position.coords.latitude)
                    var long = parseFloat(position.coords.longitude)

                    var region = {
                        latitude: lat,
                        longitude: long,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }

                    this.setState({ region: region })
                },
                    (error) => alert(JSON.stringify(error)),
                    { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 });
            } else {
                console.log("Camera permission denied");
            }
        } catch (err) {
            console.warn(err);
        }
    }

    componentWillUnmount() {
        // BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    handleBackButtonClick() {
        // BackHandler.exitApp();
    }

    onAvailableChange() {
        if (!this.state.selectedOption) {
            setTimeout(() => {
                this.setState({
                    modal: true
                })
            }, 2000)
        }
        this.setState({ selectedOption: !this.state.selectedOption });        
    }

    onAccept() {
        this.setState({
            accepted: true
        })
    }

    render() {
        const { container, availableButtonStyle, textStyle, modalStyle, ratings, imageStyle, nameStyle } = styles;
        const { receiver, selectedOption, region, accepted, modal } = this.state;
        const { rLatitude, rLongitude } = this.state.receiver;
        const { latitude, longitude } = this.state.region;
        return (
            <View style={container}>
                <StatusBar backgroundColor="blue" barStyle="light-content" />
                <MapView
                    style={{
                        height: Dimensions.get('window').height,
                        width: Dimensions.get('window').width
                    }}
                    showsUserLocation
                    region={region}
                    onRegionChange={this.onRegionChange}
                >
                    {accepted && <Marker
                        coordinate={{
                            "latitude": rLatitude,
                            "longitude": rLongitude
                        }}
                        title={"Receiver's Location"}
                        draggable />}
                    {accepted &&
                        <PolylineDirection
                            origin={{ latitude: latitude, longitude: longitude }}
                            destination={{ latitude: rLatitude, longitude: rLongitude }}
                            apiKey='AIzaSyCLQcrBEdrKgoyeip5eiPimv0ukHuOkOXk'
                            strokeWidth={4}
                            strokeColor="#ff5d5b"
                        />}
                </MapView>
                <View style={availableButtonStyle}>
                    <Text style={textStyle}>Available</Text>
                    <Switch
                        ios_backgroundColor='white'
                        thumbColor='#ff5d5b'
                        trackColor={{ true: '#ff5d5b', false: 'grey' }}
                        value={selectedOption}
                        onValueChange={() => this.onAvailableChange()}
                    />
                </View>
                <Modal animationType="fade" isVisible={modal} onRequestClose={() => this.setState({ modal: false })}
                    animationType="slide"
                    propagateSwipe
                    style={modalStyle}
                    hasBackdrop={false}
                    coverScreen={false}
                >
                    <View>
                        <View style={{ padding: 10 }}>
                            <View style={{ flexDirection: "row", paddingLeft: 10 }}>
                                <Image source={require('../../assets/img/user.jpg')} style={imageStyle} />
                                <View style={{marginLeft: 20, paddingTop: 10}}>
                                    <Text style={nameStyle}>{receiver.firstName + ' ' + receiver.lastName}</Text>
                                    <View style={ratings}>
                                        <Text style={textStyle}>{receiver.ratings}</Text>
                                        <FontAwesomeIcon
                                            name="star"
                                            size={20}
                                            color={"#ff5d5b"}
                                        />
                                    </View>
                                    <Text style={{ color: '#ff5d5b', fontSize: 14 }}>{receiver.phoneNo}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "space-evenly", width: '100%' }}>
                            <Button
                                icon={(!accepted) ? "check-underline" : "phone"}
                                mode="contained"
                                theme={buttonTheme}
                                onPress={() => (!accepted) ? this.onAccept() : Communications.phonecall(receiver.phoneNo, true)}
                            >
                                {(accepted) ? 'Call' : 'Accept'}
                            </Button>
                            {!accepted && <Button
                                icon="close-circle"
                                mode="contained"
                                theme={buttonTheme}
                                onPress={() => this.setState({ modal: false })}>
                                Reject
                            </Button>}
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }
}

const buttonTheme = {
    colors: {
        primary: "#ff5d5b",
        accent: "#ff5d5b",
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    bottomButtons: {
        width: Dimensions.get('window').width * .9,
        position: 'absolute',
        bottom: Dimensions.get('window').height * .05,
        left: Dimensions.get('window').width * .05,
        backgroundColor: 'white',
        height: 100,
        borderRadius: 10,
        shadowColor: 'black',
        shadowOffset: {
            height: 5,
            width: 2
        },
        shadowOpacity: 0.5,
        elevation: 3,
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: 'center',
    },
    availableButtonStyle: {
        position: 'absolute',
        top: Dimensions.get('window').height * .02,
        left: Dimensions.get('window').width * .65,
        flexDirection: 'row',
        backgroundColor: 'white',
        opacity: 0.80,
        paddingLeft: 5,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    textStyle: {
        color: '#ff5d5b',
        fontWeight: '700',
        fontSize: 15
    },
    modalStyle: {
        width: Dimensions.get('screen').width * .87,
        position: 'absolute',
        bottom: Dimensions.get('screen').height * .01,
        left: Dimensions.get('screen').width * .0125,
        backgroundColor: 'white',
        height: 185,
        borderRadius: 10,
        shadowColor: 'black',
        shadowOffset: {
            height: 5,
            width: 2
        },
        elevation: 4,
        shadowOpacity: 0.5,
        // flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: 'center',
    },
    loadingStyle: {
        backgroundColor: '#fff',
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 1000,
        borderRadius: 10,
        height: 100,
        left: Dimensions.get('screen').width * .3,
        top: Dimensions.get('screen').height * .3,
        position: 'absolute'
    },
    findingText: {
        color: '#ff5d5b'
    },
    ratings: {
        flexDirection: 'row',
        alignItems: 'center',        
    },
    imageStyle: {
        width: 100,
        height: 100,
        backgroundColor: 'lightgrey',
        borderRadius: 20
    },
    nameStyle: { 
        color: '#ff5d5b', 
        fontWeight: 'bold', 
        fontSize: 16,          
    }
})

export default connect(userDetailsAction.mapStateToProps, userDetailsAction.mapDispatchToProps)(DriverHome);