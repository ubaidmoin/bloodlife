import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Dimensions,
  Image,
  TouchableOpacity,
  BackHandler,
  PermissionsAndroid,
  ActivityIndicator,
} from 'react-native';
import {Button} from 'react-native-paper';
import {Picker} from '@react-native-community/picker';
import {connect} from 'react-redux';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import MapView, {Marker, AnimatedRegion} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import PolylineDirection from '@react-native-maps/polyline-direction';
import Modal from 'react-native-modal';
import Communications from 'react-native-communications';
import firestore from '@react-native-firebase/firestore';
import StarRating from 'react-native-star-rating';
import * as geolib from 'geolib';

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
      bloodGroup: this.props.route.params.bloodGroup,
      numberOfBottles: this.props.route.params.numberOfBottles,
      destination: {
        latitudeD: '',
        longitudeD: '',
      },
      modal: false,
      loading: true,
      finding: 'donor',
      donors: [],
      userDetails: props.userDetails,
      donor: {
        id: '',
        firstName: '',
        lastName: '',
        ratings: '',
        phoneNo: '',
        image: '',
        lat: 0,
        lng: 0,
      },
      requestId: '',
      currentIndex: 0,
      ratings: 0,
      submitRatings: false,
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

  async generateRequestId() {
    let id = 100;
    let response = await firestore()
      .collection('Requests')
      .orderBy('id', 'desc')
      .limit(1)
      .get()
      .then((snapshot) => {
        snapshot.forEach((element) => {
          id = parseInt(element.id.split('-')[1]);
        });
        return (id = id + 1);
      });
    return 'REQ-' + response;
  }

  addRequest = async (requestId, index) => {
    this.setState({
      loading: true,
      currentIndex: index,
    });
    if (index < this.state.donors.length) {
      if (index === 0) {
        const {id} = this.state.userDetails;
        const {latitude, longitude} = this.state.region;
        firestore()
          .collection('Requests')
          .doc(requestId)
          .set({
            id: requestId,
            receiverId: id,
            donorId: this.state.donors[index].id,
            lat: latitude,
            lng: longitude,
            status: 'requested',
            bloodGroup: this.state.bloodGroup,
            numberOfBottles: this.state.numberOfBottles,
            date: new Date().toDateString(),
          })
          .then((docRef) => {
            this.requestChecker();
            this.timer = setInterval(
              () =>
                firestore()
                  .collection('Requests')
                  .doc(requestId)
                  .update({
                    status: 'Not Accpeted',
                    donorId: 0,
                  })
                  .then(() => {
                    this.setState({
                      loading: false,
                    });
                    this.props.navigation.pop();
                  }),
              60000,
            );
          })
          .catch((error) => {
            this.setState({
              loading: false,
            });
            alert('An error occured.');
          });
      } else {
        firestore()
          .collection('Requests')
          .doc(this.state.requestId)
          .get()
          .then((querySnapshot) => {
            firestore()
              .collection('Requests')
              .doc(querySnapshot.data().id)
              .update({
                status: 'requested',
                donorId: this.state.donors[index].id,
              })
              .then(() => {});
          });
      }
    } else {
      alert('Currently no donors are available.');
      this.props.navigation.pop();
      this.setState({
        loading: false,
      });
    }
  };

  calculateDistance = (lat, lng, pLat, pLng) => {
    var dist = geolib.getDistance(
      {latitude: lat, longitude: lng},
      {
        latitude: pLat,
        longitude: pLng,
      },
    );
    dist = dist / 1000;
    return dist;
  };

  getDonors() {
    firestore()
      .collection('Users')
      .get()
      .then((snapshot) => {
        let donors = [];
        snapshot.forEach((user) => {
          if (user.data().userType === 'donor' && user.data().availability) {
            const distance = this.calculateDistance(
              this.state.region.latitude,
              this.state.region.longitude,
              user.data().lat,
              user.data().lng,
            );
            donors.push({
              id: user.id,
              lat: user.data().lat,
              lng: user.data().lng,
              distance: distance,
            });
          }
        });
        donors = donors.sort((a, b) => a.distance > b.distance);
        console.log(donors);
        this.setState({
          donors,
        });
        this.addRequest(this.state.requestId, 0);
      });
  }

  requestChecker() {
    firestore()
      .collection('Requests')
      .doc(this.state.requestId)
      .onSnapshot((snapshot) => {
        if (snapshot.data().status === 'accepted') {
          firestore()
            .collection('Users')
            .doc(snapshot.data().donorId)
            .get()
            .then((donor) => {
              this.setState({
                loading: false,
                donor: {
                  id: snapshot.data().donorId,
                  firstName: donor.data().firstName,
                  lastName: donor.data().lastName,
                  ratings: donor.data().ratings,
                  phoneNo: donor.data().phoneNo,
                  image: donor.data().image,
                  city: donor.data().city,
                  address: donor.data().address,
                  bloodGroup: donor.data().bloodGroup,
                  lat: donor.data().lat,
                  lng: donor.data().lng,
                },
                modal: true,
              });
            });
        } else if (snapshot.data().status === 'rejected') {
          let index = this.state.currentIndex + 1;
          this.addRequest(this.state.requestId, index);
        } else if (snapshot.data().status === 'Not Accpeted') {
          clearInterval(this.timer);
          alert('Currently no donors are available.');
        }
      });
  }
  async onFind() {
    let id = await this.generateRequestId();
    console.log(id);
    this.setState({
      requestId: id,
    });
    this.getDonors();
  }

  onFinishRequest() {
    firestore()
      .collection('Requests')
      .doc(this.state.requestId)
      .get()
      .then((querySnapshot) => {
        firestore()
          .collection('Requests')
          .doc(querySnapshot.data().id)
          .update({
            status: 'finished',
          })
          .then(() => {
            this.setState({
              submitRatings: true,
            });
          });
      });
  }

  submitRatings() {
    firestore()
      .collection('Users')
      .doc(this.state.donor.id)
      .get()
      .then((querySnapshot) => {
        let rating = (this.state.donor.ratings + this.state.ratings) / 2;
        firestore()
          .collection('Users')
          .doc(querySnapshot.data().id)
          .update({
            ratings: rating,
          })
          .then(() => {
            this.setState({modal: false, submitRatings: false});
            this.props.navigation.pop();
          });
      });
  }

  render() {
    const {
      container,
      mapStyle,
      modalStyle,
      loadingStyle,
      findingText,
      bottomButtons,
      ratings,
      textStyle,
      imageStyle,
      nameStyle,
    } = styles;
    const {modal, loading, finding, donor, submitRatings} = this.state;
    const {latitude, longitude} = this.state.region;
    return (
      <View style={container}>
        <StatusBar backgroundColor="blue" barStyle="light-content" />
        <MapView
          style={mapStyle}
          region={this.state.region}
          zoomEnabled={!loading}
          // onRegionChange={this.onRegionChange}
          showsUserLocation
          showsMyLocationButton={false}>
          {donor.id !== '' && (
            <PolylineDirection
              origin={{latitude: latitude, longitude: longitude}}
              destination={{latitude: donor.lat, longitude: donor.lng}}
              apiKey="AIzaSyCLQcrBEdrKgoyeip5eiPimv0ukHuOkOXk"
              strokeWidth={4}
              strokeColor="#ff5d5b"
            />
          )}
          {donor.id !== '' && (
            <Marker
              coordinate={{
                latitude: donor.lat,
                longitude: donor.lng,
              }}
              title={"Donor's Location"}
              draggable
            />
          )}
        </MapView>
        {loading && (
          <View style={loadingStyle}>
            <ActivityIndicator size={'large'} color={'#ff5d5b'} />
            <Text style={findingText}>{'Finding ' + finding}</Text>
          </View>
        )}
        <Modal
          animationType="fade"
          isVisible={modal}
          onRequestClose={() => this.setState({modal: false})}
          // eslint-disable-next-line react/jsx-no-duplicate-props
          animationType="slide"
          propagateSwipe
          style={modalStyle}
          hasBackdrop={false}
          coverScreen={false}>
          <View>
            <View style={{paddingHorizontal: 10}}>
              {!submitRatings ? (
                <View
                  style={{
                    flexDirection: 'row',
                    paddingLeft: 10,
                    width: '100%',
                  }}>
                  <Image
                    source={
                      donor.image === ''
                        ? require('../../assets/img/user.jpg')
                        : {uri: 'data:image/jpeg;base64,' + donor.image}
                    }
                    style={imageStyle}
                  />
                  <View style={{marginLeft: 20, paddingTop: 10}}>
                    <Text style={nameStyle}>
                      {donor.firstName + ' ' + donor.lastName}
                    </Text>
                    <View style={ratings}>
                      <Text style={textStyle}>{donor.ratings}</Text>
                      <FontAwesomeIcon
                        name="star"
                        size={20}
                        color={'#ff5d5b'}
                      />
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                      }}>
                      <MaterialCommunityIcon
                        color="#ff5d5b"
                        size={20}
                        name="phone"
                      />
                      <Text style={{color: '#ff5d5b', fontSize: 14}}>
                        {donor.phoneNo}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                      }}>
                      <EntypoIcon name="drop" size={20} color={'#ff5d5b'} />
                      <Text style={{color: '#ff5d5b', fontSize: 14}}>
                        {donor.bloodGroup}
                      </Text>
                    </View>
                    <Text style={{color: '#ff5d5b', fontSize: 14}}>
                      Address: {donor.address}, {donor.city}
                    </Text>
                  </View>
                </View>
              ) : (
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                  <Text style={{fontSize: 20, fontWeight: 'bold'}}>
                    Submit Ratings
                  </Text>
                  <StarRating
                    maxStars={5}
                    rating={this.state.ratings}
                    starSize={50}
                    emptyStarColor="grey"
                    containerStyle={{marginLeft: -160, width: 50}}
                    starStyle={{
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                    }}
                    selectedStar={(rating) => this.setState({ratings: rating})}
                  />
                </View>
              )}
            </View>
            {!submitRatings ? (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                  width: '100%',
                  marginBottom: 10,
                }}>
                <Button
                  icon="phone"
                  mode="contained"
                  theme={buttonTheme}
                  onPress={() => Communications.phonecall(donor.phoneNo, true)}>
                  Call
                </Button>
                <Button
                  icon="check-underline"
                  mode="contained"
                  theme={buttonTheme}
                  onPress={() => this.onFinishRequest()}>
                  Finish
                </Button>
              </View>
            ) : (
              <Button
                icon="check-underline"
                mode="contained"
                theme={buttonTheme}
                onPress={() => this.submitRatings()}>
                Submit
              </Button>
            )}
          </View>
        </Modal>
      </View>
    );
  }
}

const buttonTheme = {
  colors: {
    primary: '#ff5d5b',
    accent: '#ff5d5b',
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomButtons: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    height: 70,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  textStyle: {
    color: '#ff5d5b',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    width: Dimensions.get('window').width * 0.25,
  },
  mapStyle: {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
  },
  modalButton: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  modalStyle: {
    width: Dimensions.get('screen').width * 0.87,
    position: 'absolute',
    bottom: Dimensions.get('screen').height * 0.01,
    left: Dimensions.get('screen').width * 0.0125,
    backgroundColor: 'white',
    height: 185,
    borderRadius: 10,
    shadowColor: 'black',
    shadowOffset: {
      height: 5,
      width: 2,
    },
    elevation: 4,
    shadowOpacity: 0.5,
    // flexDirection: "row",
    justifyContent: 'space-evenly',
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
    left: Dimensions.get('screen').width * 0.3,
    top: Dimensions.get('screen').height * 0.3,
    position: 'absolute',
  },
  findingText: {
    color: '#ff5d5b',
  },
  ratings: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageStyle: {
    width: 100,
    height: 100,
    backgroundColor: 'lightgrey',
    borderRadius: 20,
  },
  nameStyle: {
    color: '#ff5d5b',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default connect(
  userDetailsAction.mapStateToProps,
  userDetailsAction.mapDispatchToProps,
)(Request);
