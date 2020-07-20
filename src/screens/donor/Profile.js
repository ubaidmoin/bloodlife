import React, {Component} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  ActivityIndicator,
  Dimensions,
  Image,
  Permission,
} from 'react-native';
import {TextInput, Button} from 'react-native-paper';
import ImagePicker from 'react-native-image-picker';
import {connect} from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-community/async-storage';

import * as userDetailsAction from '../../actions/UserDetailsAction';

const options = {
  title: 'Select Photo',
  takePhotoButtonTitle: 'Camera',
  chooseFromLibraryButtonTitle: 'Library',
};

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: props.userDetails.firstName,
      lastName: props.userDetails.lastName,
      email: props.userDetails.email,
      phoneNo: props.userDetails.phoneNo,
      dob: props.userDetails.dob,
      password: props.userDetails.password,
      address: props.userDetails.address,
      city: props.userDetails.city,
      weight: props.userDetails.weight,
      lastDonated: props.userDetails.lastDonated,
      image: props.userDetails.image,
      modal: false,
      bloodGroup: props.userDetails.bloodGroup,
      userDetails: props.userDetails,
    };
  }

  componentDidMount() {}

  pickImage() {
    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        //const source = { uri: response.uri };

        // You can also display the image using data:
        //let source = {  response.data };//already added this thing

        this.setState({
          image: response.data, //source,base64
        });
        //console.warn(this.state.avatar)
      }
    });
  }

  updateProfile() {
    this.setState({
      loading: true,
    });
    firestore()
      .collection('Users')
      .doc(this.state.userDetails.id)
      .get()
      .then((querySnapshot) => {
        firestore()
          .collection('Users')
          .doc(querySnapshot.data().id)
          .update({
            phoneNo: this.state.phoneNo,
            address: this.state.address,
            image: this.state.image,
            weight: this.state.weight,
            city: this.state.city,
          })
          .then(() => {
            firestore()
              .collection('Users')
              .doc(this.state.userDetails.id)
              .get()
              .then((user) => {
                this.setState({
                  loading: false,
                });
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
                };
                const setUser = this.props.setUserData;
                setUser(userDetails);
              });
            alert('Profile Updated.');
          });
      });
  }

  render() {
    const {container, textStyle} = styles;
    const {
      firstName,
      lastName,
      email,
      dob,
      phoneNo,
      address,
      image,
      lastDonated,
      weight,
      bloodGroup,
      city,
    } = this.state;
    return (
      <KeyboardAvoidingView style={container}>
        <ScrollView
          style={{width: Dimensions.get('screen').width}}
          contentContainerStyle={{
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <TouchableOpacity onPress={() => this.pickImage()}>
            <Image
              source={
                image === ''
                  ? require('../../assets/img/user.jpg')
                  : {uri: 'data:image/jpeg;base64,' + image}
              }
              style={styles.imageStyle}
            />
          </TouchableOpacity>
          <View style={{flexDirection: 'row'}}>
            <TextInput
              label="First Name"
              mode="outlined"
              style={{
                height: 40,
                width: '39%',
              }}
              theme={{
                colors: {primary: '#ff5d5b', underlineColor: 'black'},
              }}
              selectionColor="#ff5d5b"
              underlineColor="#ff5d5b"
              value={firstName}
              onChangeText={(firstName) => this.setState({firstName})}
              disabled={true}
            />
            <TextInput
              label="Last Name"
              mode="outlined"
              style={{
                height: 40,
                width: '39%',
                marginLeft: '2%',
              }}
              theme={{
                colors: {primary: '#ff5d5b', underlineColor: 'black'},
              }}
              selectionColor="#ff5d5b"
              underlineColor="#ff5d5b"
              value={lastName}
              onChangeText={(lastName) => this.setState({lastName})}
              disabled
            />
          </View>
          <TextInput
            label="Email"
            mode="outlined"
            style={styles.textInputStyle}
            theme={{
              colors: {primary: '#ff5d5b', underlineColor: 'black'},
            }}
            selectionColor="#ff5d5b"
            underlineColor="#ff5d5b"
            value={email}
            onChangeText={(email) => this.setState({email})}
            disabled
          />
          <TextInput
            label="Phone No."
            mode="outlined"
            style={styles.textInputStyle}
            theme={{
              colors: {primary: '#ff5d5b', underlineColor: 'black'},
            }}
            selectionColor="#ff5d5b"
            underlineColor="#ff5d5b"
            value={phoneNo}
            onChangeText={(phoneNo) => this.setState({phoneNo})}
          />
          <TextInput
            label="Date of Birth"
            mode="outlined"
            style={styles.textInputStyle}
            theme={{
              colors: {primary: '#ff5d5b', underlineColor: 'black'},
            }}
            selectionColor="#ff5d5b"
            underlineColor="#ff5d5b"
            value={dob}
            disabled
          />
          <TextInput
            label="Address"
            mode="outlined"
            style={styles.textInputStyle}
            theme={{
              colors: {primary: '#ff5d5b', underlineColor: 'black'},
            }}
            selectionColor="#ff5d5b"
            underlineColor="#ff5d5b"
            value={address}
            onChangeText={(address) => this.setState({address})}
          />
          <TextInput
            label="City"
            mode="outlined"
            style={styles.textInputStyle}
            theme={{
              colors: {primary: '#ff5d5b', underlineColor: 'black'},
            }}
            selectionColor="#ff5d5b"
            underlineColor="#ff5d5b"
            value={city}
            onChangeText={(city) => this.setState({city})}
          />
          <TextInput
            label="Blood Group"
            mode="outlined"
            style={styles.textInputStyle}
            theme={{
              colors: {primary: '#ff5d5b', underlineColor: 'black'},
            }}
            selectionColor="#ff5d5b"
            underlineColor="#ff5d5b"
            value={bloodGroup}
            onChangeText={(bloodGroup) => this.setState({bloodGroup})}
            disabled
          />
          <TextInput
            label="Weight"
            mode="outlined"
            style={styles.textInputStyle}
            theme={{
              colors: {primary: '#ff5d5b', underlineColor: 'black'},
            }}
            selectionColor="#ff5d5b"
            underlineColor="#ff5d5b"
            value={weight}
            keyboardType={'number-pad'}
            onChangeText={(weight) => this.setState({weight})}
          />
          <TextInput
            label="Last Donated"
            mode="outlined"
            style={styles.textInputStyle}
            theme={{
              colors: {primary: '#ff5d5b', underlineColor: 'black'},
            }}
            selectionColor="#ff5d5b"
            underlineColor="#ff5d5b"
            value={lastDonated}
            onChangeText={(lastDonated) => this.setState({lastDonated})}
            disabled
          />
          <View style={{paddingTop: 10, paddingBottom: 10}}>
            <TouchableOpacity
              style={
                this.state.loading
                  ? styles.buttonLoadingStyle
                  : styles.buttonStyle
              }
              disabled={this.state.loading}
              onPress={() => this.updateProfile()}>
              {this.state.loading ? (
                <ActivityIndicator size="small" color="#ff5d5b" />
              ) : (
                <Text style={textStyle}>{'update'.toUpperCase()}</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  modalButton: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  modalStyle: {
    position: 'absolute',
    bottom: 2,
    backgroundColor: 'white',
    width: Dimensions.get('screen').width,
  },
  imageStyle: {
    width: 100,
    height: 100,
    backgroundColor: 'lightgrey',
    borderRadius: 50,
  },
  textInputStyle: {
    height: 40,
    width: '80%',
  },
  textStyle: {
    color: 'white',
  },
  buttonStyle: {
    backgroundColor: '#ff5d5b',
    height: 30,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#fea39e',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  buttonLoadingStyle: {
    backgroundColor: '#ffffff',
    height: 30,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#fea39e',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
});

export default connect(
  userDetailsAction.mapStateToProps,
  userDetailsAction.mapDispatchToProps,
)(Profile);
