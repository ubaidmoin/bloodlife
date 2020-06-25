import React, { Component } from 'react';
import { View, Text, StyleSheet, StatusBar, Dimensions, Image, TouchableOpacity, BackHandler, Switch, PermissionsAndroid } from 'react-native';
import { Button } from 'react-native-paper';
import MapView, { Marker, AnimatedRegion } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';
import { connect } from 'react-redux';
import PolylineDirection from '@react-native-maps/polyline-direction';
import Modal from 'react-native-modal';
import Communications from 'react-native-communications';
import firestore from '@react-native-firebase/firestore';
import StarRating from 'react-native-star-rating';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import UIStepper from 'react-native-ui-stepper';
import { Picker } from '@react-native-community/picker';
import { moment } from 'moment';
import { AndroidBackHandler } from "react-navigation-backhandler";

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
                latitude: 33.7875080,
                longitude: 72.7226303,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05
            },
            selectedOption: false,
            receiver: {
                lat: 0,
                lng: 0
            },
            accepted: false,
            modal: false,
            userDetails: props.userDetails,
            requestId: '',
            ratings: 0,
            submitRatings: false,
            selectedTab: -1,
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
            modalRequest: false,
            modalDonor: false,
            selectedHospital: '',
            checkAlert: '',
            loading: false,
            finding: '',
            numberOfBottles: 0,
            bloodGroup: 'A+',
            bloodGroupOptions: [
                { label: 'A+', value: 'A+' }, { label: 'B+', value: 'B+' }, { label: 'AB+', value: 'AB+' }, { label: 'O+', value: 'O+' },
                { label: 'A-', value: 'A-' }, { label: 'B-', value: 'B-' }, { label: 'AB-', value: 'AB-' }, { label: 'O-', value: 'O-' },
            ],
        };
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }

    onBackButtonPressAndroid = () => {
        BackHandler.exitApp();
        return true;
    };

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

    changeAvailabilityStatus(status, lat, lng) {
        firestore().collection('Users').doc(this.state.userDetails.id)
            .get()
            .then((querySnapshot) => {
                firestore().collection('Users').doc(querySnapshot.data().id).update({
                    availability: status,
                    lat: lat,
                    lng: lng
                }).then(() => {
                    firestore().collection('Users').doc(this.state.userDetails.id)
                        .get()
                        .then(user => {
                            this.setState({
                                loading: false
                            })
                            let userDetails = {
                                id: user.id,
                                firstName: user.data().firstName,
                                lastName: user.data().lastName,
                                email: user.data().email,
                                phoneNo: user.data().phoneNo,
                                userType: user.data().userType,
                                ratings: user.data().ratings,
                                dob: user.data().dob,
                                address: user.data().address,
                                image: user.data().image,
                                weight: user.data().weight,
                                lastDonated: user.data().lastDonated,
                                bloodGroup: user.data().bloodGroup,
                                availability: user.data().availability,
                                lat: user.data().lat,
                                lng: user.data().lng
                            }
                            const setUser = this.props.setUserData;
                            setUser(userDetails);
                            this.requestChecker();
                        })
                });
            })
    }

    requestChecker() {
        firestore().collection('Requests').orderBy('id', 'desc').limit(1).onSnapshot(snapshot => {
            snapshot.forEach(doc => {
                if (doc.data().status === "requested") {
                    this.setState({
                        requestId: doc.data().id
                    })
                    firestore().collection('Users').doc(doc.data().receiverId).get().then(receiver => {
                        this.setState({
                            receiver: {
                                id: doc.data().receiverId,
                                firstName: receiver.data().firstName,
                                lastName: receiver.data().lastName,
                                ratings: receiver.data().ratings,
                                phoneNo: receiver.data().phoneNo,
                                image: receiver.data().image,
                                lat: doc.data().lat,
                                lng: doc.data().lng,
                                bloodGroup: doc.data().bloodGroup,
                                numberOfBottles: doc.data().numberOfBottles,
                                address: doc.data().address,
                                city: doc.data().city,
                            },
                            modalDonor: true
                        })
                    })
                } else if (doc.data().status === "finished") {
                    this.setState({
                        submitRatings: true
                    })
                }
            })
        })
    }

    onAvailableChange() {
        // const today = new Date();
        // const lastDonated =  moment(this.state.userDetails.lastDonated, 'DD-MM-YYYY').toDate();
        // const months = today.diff(lastDonated, 'months');
        // if (months >= 3) {
        if (!this.state.selectedOption) {
            this.changeAvailabilityStatus(true, this.state.region.latitude, this.state.region.longitude);
        } else {
            this.changeAvailabilityStatus(false, 0, 0);
        }
        this.setState({ selectedOption: !this.state.selectedOption });
        // } else {
        //     alert('It\'s been less than 3 months you last donated blood.');
        // }
    }

    onAccept() {
        firestore().collection('Requests').doc(this.state.requestId)
            .get()
            .then((querySnapshot) => {
                firestore().collection('Requests').doc(querySnapshot.data().id).update({
                    status: "accepted"
                }).then(() => {
                    firestore().collection('Users').doc(this.state.userDetails.id)
                        .get()
                        .then((querySnapshot) => {
                            firestore().collection('Users').doc(querySnapshot.data().id).update({
                                availability: false,
                                lat: 0,
                                lng: 0,
                                lastDonated: new Date().toDateString()
                            }).then(() => {
                                this.setState({
                                    accepted: true,
                                    selectedOption: false
                                })
                            })
                        })
                })
            })
    }

    onReject() {
        firestore().collection('Requests').doc(this.state.requestId)
            .get()
            .then((querySnapshot) => {
                firestore().collection('Requests').doc(querySnapshot.data().id).update({
                    status: "rejected"
                }).then(() => {
                    this.setState({ modal: false });
                })
            })
    }

    submitRatings() {
        firestore().collection('Users').doc(this.state.receiver.id)
            .get()
            .then((querySnapshot) => {
                let rating = (this.state.receiver.ratings + this.state.ratings) / 2;
                firestore().collection('Users').doc(querySnapshot.data().id).update({
                    ratings: rating
                }).then(() => {
                    this.setState({ modal: false, submitRatings: false, selectedOption: true, modalDonor: false });
                    this.changeAvailabilityStatus(true, this.state.region.latitude, this.state.region.longitude);
                })
            })
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
            latitudeDelta: (place === "pharmacy") ? 0.05 : (place === "hospitals") ? 0.0005 : 0.0005,
            longitudeDelta: (place === "pharmacy") ? 0.05 : (place === "hospitals") ? 0.0005 : 0.0005,
        }

        this.setState({
            region: {
                latitude: this.state.region.latitude,
                longitude: this.state.region.longitude,
                latitudeDelta: (place === "pharmacy") ? 0.05 : (place === "hospitals") ? 0.15 : 0.15,
                longitudeDelta: (place === "pharmacy") ? 0.05 : (place === "hospitals") ? 0.15 : 0.15,
            }
        })

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
        this.props.navigation.navigate('DonorRequest', { lat: this.state.region.latitude, lng: this.state.region.longitude, bloodGroup: this.state.bloodGroup, numberOfBottles: this.state.numberOfBottles });
    }

    renderShowLocationButton = () => {
        return (
            <TouchableOpacity
                style={styles.myLocationButton}
                onPress={() => {
                    this.getCurrentPosition()
                }}
            >
                <MaterialCommunityIcons name='crosshairs-gps' size={25} />
            </TouchableOpacity>
        )
    }

    // onRegionChange(region) {
    //     this.setState({ region });
    // }

    render() {
        const { availabilityTextStyle, modalRequestStyle, modalViewStyle, modalTextStyle, container, availableButtonStyle, textStyle, modalStyle, ratings, imageStyle, nameStyle, bottomButtons, selectedTextStyle, firstButtonStyle, buttonStyle } = styles;
        const { bloodGroup, bloodGroupOptions, numberOfBottles, receiver, selectedOption, region, accepted, modal, submitRatings, selectedTab, modalDonor, loading, markers, modalRequest, hospitalAddress, hospitalName, hospitalPhone, userDetails } = this.state;
        const { lat, lng } = this.state.receiver;
        const { latitude, longitude } = this.state.region;
        const { latitudeD, longitudeD } = this.state.destination;
        return (
            <AndroidBackHandler onBackPress={this.onBackButtonPressAndroid}>
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
                        showsMyLocationButton={false}
                    >
                        {accepted && <Marker
                            coordinate={{
                                "latitude": lat,
                                "longitude": lng
                            }}
                            title={"Receiver's Location"}
                            draggable />}
                        {accepted &&
                            <PolylineDirection
                                origin={{ latitude: latitude, longitude: longitude }}
                                destination={{ latitude: lat, longitude: lng }}
                                apiKey='AIzaSyCLQcrBEdrKgoyeip5eiPimv0ukHuOkOXk'
                                strokeWidth={4}
                                strokeColor="#ff5d5b"
                            />}
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
                    <View style={availableButtonStyle}>
                        <Text style={availabilityTextStyle}>Available</Text>
                        <Switch
                            ios_backgroundColor='white'
                            thumbColor='#ff5d5b'
                            trackColor={{ true: '#ff5d5b', false: 'grey' }}
                            value={selectedOption}
                            onValueChange={() => this.onAvailableChange()}
                        />
                    </View>
                    {this.renderShowLocationButton()}
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
                            onPress={() => this.onFind('hospital')}
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
                            onPress={() => { this.setState({ selectedTab: -1 }); this.props.navigation.navigate('DonorEmergencyContacts') }}
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
                    {receiver && <Modal animationType="fade" isVisible={modalDonor} onRequestClose={() => this.setState({ modal: false })}
                        animationType="slide"
                        propagateSwipe
                        style={modalStyle}
                        hasBackdrop={false}
                        coverScreen={false}
                    >
                        <View>
                            <View style={{ padding: 10 }}>
                                {(!submitRatings) ? <View style={{ flexDirection: "row", paddingLeft: 10 }}>
                                    <Image source={(userDetails.image !== "") ? { uri: 'data:image/jpeg;base64,' + receiver.image } : require('../../assets/img/user.jpg')} style={imageStyle} />
                                    <View style={{ marginLeft: 20, paddingTop: 10 }}>
                                        <Text style={nameStyle}>{receiver.firstName + ' ' + receiver.lastName}</Text>
                                        <View style={ratings}>
                                            <Text style={nameStyle}>{receiver.ratings}</Text>
                                            <FontAwesomeIcon
                                                name="star"
                                                size={20}
                                                color={"#ff5d5b"}
                                            />
                                        </View>
                                        <Text style={{ color: '#ff5d5b', fontSize: 14 }}>{receiver.phoneNo}</Text>
                                        <Text style={{ color: '#ff5d5b', fontSize: 14 }}>{receiver.address}</Text>
                                        <Text style={{ color: '#ff5d5b', fontSize: 14 }}>{receiver.city}</Text>
                                        <Text style={{ color: '#ff5d5b', fontSize: 14 }}>Blood Group: {receiver.bloodGroup}</Text>
                                        <Text style={{ color: '#ff5d5b', fontSize: 14 }}>Number of Bottles: {receiver.numberOfBottles}</Text>
                                    </View>
                                </View> :
                                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Submit Ratings</Text>
                                        <StarRating
                                            maxStars={5}
                                            rating={this.state.ratings}
                                            starSize={50}
                                            emptyStarColor="grey"
                                            containerStyle={{ marginLeft: -160, width: 50 }}
                                            starStyle={{ flexDirection: 'row', justifyContent: 'flex-start' }}
                                            selectedStar={(rating) => this.setState({ ratings: rating })}
                                        />
                                    </View>
                                }
                            </View>
                            {(!submitRatings) ? <View style={{ flexDirection: "row", justifyContent: "space-evenly", width: '100%' }}>
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
                                    onPress={() => this.onReject()}>
                                    Reject
                            </Button>}
                            </View> :
                                <Button
                                    icon={"check-underline"}
                                    mode="contained"
                                    theme={buttonTheme}
                                    onPress={() => this.submitRatings()}
                                >
                                    {'Submit'}
                                </Button>
                            }
                        </View>
                    </Modal>}
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
                                        <View style={{ width: Dimensions.get('window').width * .3 }}>

                                        </View>
                                        <TouchableOpacity style={styles.cancelButton} onPress={() => this.setState({ modalRequest: false })}>
                                            <Text style={{ fontSize: 16, color: '#ff5d5b' }}>Cancel</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.doneButton}
                                            disabled={(this.state.numberOfBottles === 0) ? true : false}
                                            onPress={() =>
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
            </AndroidBackHandler>
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
    availabilityTextStyle: {
        color: '#ff5d5b',
        fontWeight: 'bold',
        fontSize: 15
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
    modalStyle: {
        width: Dimensions.get('screen').width * .87,
        position: 'absolute',
        bottom: Dimensions.get('screen').height * .01,
        left: Dimensions.get('screen').width * .0125,
        backgroundColor: 'white',
        height: 215,
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
    },
    firstButtonStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        width: Dimensions.get('window').width * .2,
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
    myLocationButton: {
        backgroundColor: 'white',
        opacity: 0.9,
        position: 'absolute',
        top: 60,
        right: 10,
        padding: 10,
        elevation: 3,
        alignItems: 'center',
        alignSelf: 'flex-end',
        justifyContent: 'center',
        borderRadius: 5
    }
})

export default connect(userDetailsAction.mapStateToProps, userDetailsAction.mapDispatchToProps)(DriverHome);