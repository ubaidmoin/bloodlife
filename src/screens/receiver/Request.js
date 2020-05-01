import React, { Component } from 'react';
import { View, Text, StyleSheet, StatusBar, Dimensions, Image, TouchableOpacity, BackHandler, PermissionsAndroid, ActivityIndicator } from 'react-native';
import { Button } from 'react-native-paper';
import { Picker } from '@react-native-community/picker';
import { connect } from 'react-redux';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import MapView, { Marker, AnimatedRegion } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import PolylineDirection from '@react-native-maps/polyline-direction';
import Modal from 'react-native-modal';
import Communications from 'react-native-communications';

import * as userDetailsAction from '../../actions/UserDetailsAction';

class Request extends Component {

    constructor(props) {
        super(props);
        this.state = {
            region: {
                latitude: this.props.route.params.lat,
                longitude: this.props.route.params.lng,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
            },
            destination: {
                latitudeD: '',
                longitudeD: ''
            },
            modal: false,
            loading: true,
            finding: 'donor',                        
            donor: {
                id: 1,
                firstName: 'Awais',
                lastName: 'Khan',
                ratings: 4.5,
                phoneNo: '0234234234',
                dLatitude: 33.5969,
                dLongitude: 73.0528,
            }
        };
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }

    componentDidMount() {
        // BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
        this.onFind();
    }

    componentWillUnmount() {
        // BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    handleBackButtonClick() {
        // BackHandler.exitApp();
    }

    onRegionChange(region) {
        region => this.setState({ region });
    }

    onFind() {       
        setTimeout(() => {
            this.setState({
                loading: false,
                finding: '',
                modal: true
            })
        }, 2000)
    }

    render() {
        const { container, mapStyle, modalStyle, loadingStyle, findingText, bottomButtons, ratings, textStyle, imageStyle, nameStyle } = styles;
        const { modal, loading, finding, donor } = this.state;
        const { latitude, longitude } = this.state.region;
        return (
            <View style={container}>
                <StatusBar backgroundColor="blue" barStyle="light-content" />
                <MapView
                    style={mapStyle}
                    region={this.state.region}
                    zoomEnabled={!loading}
                    onRegionChange={this.onRegionChange}
                >
                </MapView>
                {loading &&
                    <View style={loadingStyle}>
                        <ActivityIndicator size={"large"} color={"#ff5d5b"} />
                        <Text style={findingText}>{'Finding ' + finding}</Text>
                    </View>
                }                
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
                                    <Text style={nameStyle}>{donor.firstName + ' ' + donor.lastName}</Text>
                                    <View style={ratings}>
                                        <Text style={textStyle}>{donor.ratings}</Text>
                                        <FontAwesomeIcon
                                            name="star"
                                            size={20}
                                            color={"#ff5d5b"}
                                        />
                                    </View>
                                    <Text style={{ color: '#ff5d5b', fontSize: 14 }}>{donor.phoneNo}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "space-evenly", width: '100%' }}>
                            <Button
                                icon="phone"
                                mode="contained"
                                theme={buttonTheme}
                                onPress={() => Communications.phonecall(donor.phoneNo, true)}
                            >
                                Call
                            </Button>
                            <Button
                                icon="close-circle"
                                mode="contained"
                                theme={buttonTheme}
                                onPress={() => this.setState({ modal: false })}>
                                Cancel
                            </Button>
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
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        height: 70,
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: 'center',
    },
    textStyle: {
        color: '#ff5d5b',
        fontWeight: 'bold',
        fontSize: 16
    },
    buttonStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        width: Dimensions.get('window').width * .25
    },
    mapStyle: {
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width
    },
    modalButton: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10
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

export default connect(userDetailsAction.mapStateToProps, userDetailsAction.mapDispatchToProps)(Request);