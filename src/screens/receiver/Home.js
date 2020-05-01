import React, { Component } from 'react';
import { View, Text, StyleSheet, StatusBar, Dimensions, Image, TouchableOpacity, BackHandler, PermissionsAndroid, ActivityIndicator } from 'react-native';
import { Button } from 'react-native-paper';
import { connect } from 'react-redux';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import MapView, { Marker, AnimatedRegion } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import PolylineDirection from '@react-native-maps/polyline-direction';
import Modal from 'react-native-modal';
import { Picker } from '@react-native-community/picker';
import UIStepper from 'react-native-ui-stepper';

import * as userDetailsAction from '../../actions/UserDetailsAction';

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            region: {
                latitude: 33.5969,
                longitude: 73.0528,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
            },
            destination: {
                latitudeD: '',
                longitudeD: ''
            },
            places: [],
            markers: [],
            hospitalName: '',
            hospitalAddress: '',
            hospitalPhone: '',
            makePath: false,
            modal: false,
            modalRequest: false,
            selectedHospital: '',
            checkAlert: '',
            loading: false,
            finding: '',
            selectedTab: -1,
            bloodGroup: '',
            bloodGroupOptions: [
                { label: 'A+', value: 'A+' }, { label: 'B+', value: 'B+' }, { label: 'AB+', value: 'AB+' }, { label: 'O+', value: 'O+' },
                { label: 'A-', value: 'A-' }, { label: 'B-', value: 'B-' }, { label: 'AB-', value: 'AB-' }, { label: 'O-', value: 'O-' },
            ],
            numberOfBottles: 1
        };
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }

    async componentDidMount() {
        // BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
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
                        latitude: 33.5969,
                        longitude: 73.0528,
                        latitudeDelta: 0.05,
                        longitudeDelta: 0.05,
                    }

                    this.setState({ region: region })
                },
                    (error) => alert(JSON.stringify(error)),
                    { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 });
            } else {
                console.log("Location permission denied");
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

    onRegionChange(region) {
        region => this.setState({ region });
    }

    onFind(place) {
        this.setState({
            loading: true,
            finding: place,
            selectedTab: (place === "pharmacy") ? 1 : (place === "hospitals") ? 2 : (place === "blood bank") ? 3 : -1
        })
        let places = []
        let markers = []
        let region = {
            latitude: '',
            longitude: ''
        }
        var key = 'AIzaSyCLQcrBEdrKgoyeip5eiPimv0ukHuOkOXk'

        region = {
            latitude: this.state.region.latitude,
            longitude: this.state.region.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
        }

        fetch(`https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${key}&input=${place}&location=${region.latitude},${region.longitude}&radius=200`)
            .then((response) => response.json())
            .then(res => {
                places = res.predictions;
                places.forEach(place => {
                    fetch(`https://maps.googleapis.com/maps/api/place/details/json?placeid=${place.place_id}&key=${key}`)
                        .then((r) => r.json())
                        .then(re => {
                            markers.push({
                                latitude: re.result.geometry.location.lat,
                                longitude: re.result.geometry.location.lng,
                                hospitalName: re.result.name,
                                hospitalAddress: re.result.formatted_address,
                                hospitalPhone: re.result.formatted_phone_number
                            })
                            this.setState({
                                markers: markers,
                                loading: false
                            })
                        })
                })
            })
    }

    onRequestDonor() {
        this.setState({
            selectedTab: 0,
            modalRequest: true
        })
    }

    onRequest() {
        this.setState({
            selectedTab: -1,
            modalRequest: false
        })
        this.props.navigation.navigate('Request', {lat: this.state.region.latitude, lng: this.state.region.longitude});
    }

    render() {
        const { container, mapStyle, bottomButtons, textStyle, buttonStyle, firstButtonStyle, modalStyle, loadingStyle, findingText, selectedTextStyle, modalRequestStyle, modalViewStyle, modalTextStyle } = styles;
        const { markers, modal, modalRequest, hospitalName, hospitalAddress, hospitalPhone, loading, finding, selectedTab, numberOfBottles, bloodGroup, bloodGroupOptions } = this.state;
        const { latitude, longitude } = this.state.region;
        const { latitudeD, longitudeD } = this.state.destination;
        return (
            <View style={container}>
                <StatusBar backgroundColor="blue" barStyle="light-content" />
                <MapView
                    style={mapStyle}
                    region={this.state.region}
                    zoomEnabled={!loading}
                    onRegionChange={this.onRegionChange}
                >
                    {(this.state.makePath) ?
                        <PolylineDirection
                            origin={{ latitude: latitude, longitude: longitude }}
                            destination={{ latitude: latitudeD, longitude: longitudeD }}
                            apiKey='AIzaSyCLQcrBEdrKgoyeip5eiPimv0ukHuOkOXk'
                            strokeWidth={4}
                            strokeColor="#ff5d5b"
                        /> : null}
                    {
                        markers.map((marker, index) =>
                            <Marker key={index} coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
                                onPress={() => this.setState({
                                    makePath: (this.state.selectedHospital === index) ? true : false,
                                    modal: true,
                                    destination: {
                                        latitudeD: marker.latitude, longitudeD: marker.longitude
                                    },
                                    hospitalName: marker.hospitalName,
                                    hospitalAddress: marker.hospitalAddress,
                                    hospitalPhone: marker.hospitalPhone,
                                    selectedHospital: index,
                                })}
                            />
                        )
                    }
                </MapView>
                {loading &&
                    <View style={loadingStyle}>
                        <ActivityIndicator size={"large"} color={"#ff5d5b"} />
                        <Text style={findingText}>{'Finding ' + finding}</Text>
                    </View>
                }
                <View style={bottomButtons}>
                    <TouchableOpacity
                        style={firstButtonStyle}
                        disabled={loading}
                        onPress={() => this.onRequestDonor()}
                    >
                        <EntypoIcon
                            name="drop"
                            size={25}
                            color={(selectedTab !== 0) ? "#ff5d5b" : "red"}
                        />
                        <Text style={(selectedTab === 0) ? selectedTextStyle : textStyle}>
                            REQUEST BLOOD
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={buttonStyle}
                        disabled={loading}
                        onPress={() => this.onFind('pharmacy')}
                    >
                        <MaterialIcon
                            name="local-pharmacy"
                            size={25}
                            color={(selectedTab !== 1) ? "#ff5d5b" : "red"}
                        />
                        <Text style={(selectedTab === 1) ? selectedTextStyle : textStyle}>
                            FIND PHARMACY
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={buttonStyle}
                        disabled={loading}
                        onPress={() => this.onFind('hospitals')}
                    >
                        <FontAwesomeIcon
                            name="hospital"
                            size={25}
                            color={(selectedTab !== 2) ? "#ff5d5b" : "red"}
                        />
                        <Text style={(selectedTab === 2) ? selectedTextStyle : textStyle}>
                            FIND HOSPITAL
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={buttonStyle}
                        disabled={loading}
                        onPress={() => this.onFind('blood bank')}
                    >
                        <MaterialCommunityIcons
                            name="blood-bag"
                            size={25}
                            color={(selectedTab !== 3) ? "#ff5d5b" : "red"}
                        />
                        <Text style={(selectedTab === 3) ? selectedTextStyle : textStyle}>
                            FIND BLOODBANK
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={buttonStyle}
                        disabled={loading}
                        onPress={() => {this.setState({selectedTab: -1}); this.props.navigation.navigate('EmergencyContacts')}}
                    >
                        <SimpleLineIcon
                            name="call-out"
                            size={25}
                            color="#ff5d5b"
                        />
                        <Text style={textStyle}>
                            EMERGENCY
                        </Text>
                    </TouchableOpacity>
                </View>
                <Modal animationType="fade" isVisible={modal} onRequestClose={() => this.setState({ modal: false })}
                    animationType="slide"
                    propagateSwipe
                    style={modalStyle}
                    hasBackdrop={false}
                    coverScreen={false}
                >
                    <View >
                        <View style={{ padding: 5 }}>
                            <View style={{ flexDirection: "row", paddingLeft: 10 }}>
                                <Image source={require('../../assets/img/logo.jpeg')} style={{
                                    width: 40, height: 40, backgroundColor: 'lightgrey', borderRadius: 20
                                }} />
                                <View>
                                    <Text style={{ color: '#ff5d5b', fontWeight: 'bold', fontSize: 14, marginLeft: 20 }}>{hospitalName}</Text>
                                    <Text style={{ color: '#ff5d5b', fontSize: 14, marginLeft: 20 }}>{hospitalPhone}</Text>
                                </View>
                            </View>
                            <View style={{ paddingLeft: 60 }}>
                                <Text style={{ color: '#ff5d5b', fontSize: 14, marginLeft: 20 }}>{hospitalAddress}</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "space-evenly", width: '100%' }}>
                            <Button
                                icon="directions"
                                mode="contained"
                                disabled={this.state.makePath}
                                theme={buttonTheme}
                                onPress={() => this.setState({ makePath: true, checkAlert: true })}>
                                Show Route
                                </Button>
                            <Button
                                icon="close-circle"
                                mode="contained"
                                theme={buttonTheme}
                                onPress={() => this.setState({ modal: false, selectedHospital: null, makePath: false })}>
                                Cancel
                                </Button>
                        </View>
                    </View>
                </Modal>
                {
                    //Request Donor for blood
                }
                <Modal animationType="fade" isVisible={modalRequest} onRequestClose={() => this.setState({ modalRequest: false })}
                    animationType="slide"
                    propagateSwipe
                    style={modalRequestStyle}
                >
                    <View >
                        <View style={{ padding: 5 }}>
                            <View style={modalViewStyle}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '93%' }}>
                                    <Text style={modalTextStyle}>
                                        Number of bottles
                                    </Text>
                                    <UIStepper
                                        value={numberOfBottles}
                                        displayValue={true}
                                        onValueChange={(value) => this.setState({ numberOfBottles: value })}
                                        tintColor='#ff5d5b'
                                        borderColor='#ff5d5b'
                                        textColor='#ff5d5b'
                                        width={70}
                                        height={25}
                                        minValue={1}
                                    />
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '93%' }}>
                                    <Text style={modalTextStyle}>
                                        Blood Group
                            </Text>
                                    <Picker
                                        selectedValue={bloodGroup}
                                        style={{ width: '70%' }}
                                        onValueChange={(itemValue, itemIndex) =>
                                            this.setState({ bloodGroup: itemValue })
                                        }>
                                        {
                                            bloodGroupOptions.map((item, index) =>
                                                <Picker.Item key={index} label={item.label} value={item.value} />
                                            )
                                        }
                                    </Picker>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '90%' }}>
                                    <View style={{width: Dimensions.get('window').width * .3}}>

                                    </View>                                    
                                    <TouchableOpacity style={styles.cancelButton} onPress={() => this.setState({modalRequest: false})}>
                                        <Text style={{ fontSize: 16, color: '#ff5d5b' }}>Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.doneButton} onPress={() => 
                                        this.onRequest()                                    
                                    }>
                                        <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Request</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
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
        opacity: 0.9,
        height: 60,
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: 'center',
    },
    textStyle: {
        color: '#ff5d5b',
        fontWeight: 'bold',
        fontSize: 8.25
    },
    selectedTextStyle: {
        color: 'red',
        fontWeight: 'bold',
        fontSize: 8.30
    },
    buttonStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        width: Dimensions.get('window').width * .2,
    },
    firstButtonStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        width: Dimensions.get('window').width * .2,
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
        bottom: Dimensions.get('screen').height * .12,
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
    modalRequestStyle: {
        width: Dimensions.get('screen').width * .87,
        position: 'absolute',
        bottom: Dimensions.get('screen').height * .3,
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
        justifyContent: "center",
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
    modalViewStyle: {
        width: '90%',
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },
    modalTextStyle: {
        color: '#ff5d5b',
        fontWeight: 'bold',
        fontSize: 16
    },
    doneButton: {
        backgroundColor: '#ff5d5b',
        justifyContent: 'center',
        alignItems: 'center',
        height: 25,
        borderRadius: 2,
        marginLeft: 5,
        paddingVertical: 5,
        paddingHorizontal: 15
      },
      skipButton: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 25,
        paddingVertical: 5,
        paddingHorizontal: 15
      }
})

export default connect(userDetailsAction.mapStateToProps, userDetailsAction.mapDispatchToProps)(Home);