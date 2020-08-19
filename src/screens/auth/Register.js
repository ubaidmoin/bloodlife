import React, {Component} from 'react';
import {
  Keyboard,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  ActivityIndicator,
  ImageBackground,
  Platform,
  StyleSheet,
} from 'react-native';
import {TextInput} from 'react-native-paper';
import TextInputMask from 'react-native-text-input-mask';
import DatePicker from 'react-native-datepicker';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import * as Validations from '../../settings/Validations';

export default class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      phoneNo: '',
      address: '',
      city: '',
      password: '',
      confirmPassword: '',
      dob: new Date(),
      error: '',
      loading: false,
      passwordMatch: false,
      showPassword: true,
    };
    // this.ref = firebase.firestore().collection('Users');
  }

  async generateUserId() {
    let id = 100;
    let response = await firestore()
      .collection('Users')
      .orderBy('id', 'desc')
      .limit(1)
      .get()
      .then((snapshot) => {
        snapshot.forEach((element) => {
          id = parseInt(element.data().id.split('-')[1]);
        });
        return (id = id + 1);
      });
    console.log('BL-' + response);
    return 'BL-' + response;
  }

  componentDidMount() {}

  async onButtonPress() {
    Keyboard.dismiss();
    const {
      firstName,
      lastName,
      email,
      phoneNo,
      password,
      address,
      city,
    } = this.state;
    if (firstName === '') {
      alert('First Name field should not be empty.');
    } else if (lastName === '') {
      alert('Last Name field should not be empty.');
    } else if (email === '') {
      alert('Email field should not be empty.');
    } else if (!Validations.verifyEmail(email)) {
      alert('Email is invalid.');
    } else if (phoneNo === '') {
      alert('Phone Number field should not be empty.');
    } else if (!Validations.verifyPhoneNumber(phoneNo)) {
      alert('Phone Number is invalid.');
    } else if (password === '') {
      alert('Password field should not be empty.');
    } else if (address === '') {
      alert('Address field should not be empty.');
    } else if (city === '') {
      alert('City field should not be empty.');
    } else {
      this.setState({
        loading: true,
      });

      auth()
        .createUserWithEmailAndPassword(email, password)
        .then(async (doc) => {
          const id = await this.generateUserId();
          console.log(id);
          const user = await this.addUser(id);
          if (user) {
            doc.user
              .sendEmailVerification()
              .then(() => alert('Verification link sent to your email.'))
              .catch((err) => console.log(err));
          } else {
            console.log(user);
          }
          this.setState({
            loading: false,
          });
        })
        .catch((err) => {
          console.log(err);
          this.setState({
            loading: false,
          });
          alert('User already exists.');
        });
    }
  }

  addUser = (id) =>
    new Promise((resolve, reject) => {
      const {
        firstName,
        lastName,
        email,
        phoneNo,
        password,
        confirmPassword,
        address,
        dob,
        city,
      } = this.state;
      if (password === confirmPassword) {
        firestore()
          .collection('Users')
          .doc(id)
          .set({
            id: id,
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            phoneNo: phoneNo,
            address: address,
            dob: dob,
            city: city,
            userType: 'receiver',
            ratings: 5,
            image: '',
            blocked: false,
          })
          .then((docRef) => {
            console.log(docRef);
            resolve(true);
            this.setState({
              loading: false,
              email: '',
              password: '',
              confirmPassword: '',
              firstName: '',
              lastName: '',
              phoneNo: '',
              address: '',
              city: '',
            });
          })
          .catch((error) => {
            console.log(error);
            reject(false);
            this.setState({
              loading: false,
              email: '',
              password: '',
              confirmPassword: '',
              firstName: '',
              lastName: '',
              phoneNo: '',
              address: '',
              city: '',
            });
            alert('An error occured.');
          });
      } else {
        alert('Password & confirm password should be same.');
      }
    });

  render() {
    const {container} = styles;
    return (
      <ScrollView>
        <KeyboardAvoidingView style={container}>
          <ImageBackground
            source={require('../../assets/img/logo.jpeg')}
            style={{width: 200, height: Platform.OS === 'ios' ? 180 : 170}}
          />
          <View style={{flexDirection: 'row'}}>
            <TextInput
              label="First Name"
              mode="outlined"
              style={{
                height: 35,
                width: '39%',
              }}
              theme={{
                colors: {primary: '#ff5d5b', underlineColor: 'black'},
              }}
              selectionColor="#ff5d5b"
              underlineColor="#ff5d5b"
              value={this.state.firstName}
              onChangeText={(firstName) => this.setState({firstName})}
            />
            <TextInput
              label="Last Name"
              mode="outlined"
              style={{
                height: 35,
                width: '39%',
                marginLeft: '2%',
              }}
              theme={{
                colors: {primary: '#ff5d5b', underlineColor: 'black'},
              }}
              selectionColor="#ff5d5b"
              underlineColor="#ff5d5b"
              value={this.state.lastName}
              onChangeText={(lastName) => this.setState({lastName})}
            />
          </View>
          <TextInput
            label="Email"
            mode="outlined"
            style={{
              height: 35,
              width: '80%',
            }}
            theme={{
              colors: {primary: '#ff5d5b', underlineColor: 'black'},
            }}
            selectionColor="#ff5d5b"
            underlineColor="#ff5d5b"
            value={this.state.email}
            onChangeText={(email) => this.setState({email})}
          />
          <TextInput
            label="Phone No."
            render={(props) => (
              <TextInputMask {...props} mask="+92 ([000]) [000] [0000]" />
            )}
            mode="outlined"
            style={{
              height: 35,
              width: '80%',
            }}
            theme={{
              colors: {primary: '#ff5d5b', underlineColor: 'black'},
            }}
            selectionColor="#ff5d5b"
            underlineColor="#ff5d5b"
            keyboardType="phone-pad"
            value={this.state.phoneNo}
            onChangeText={(phoneNo) => this.setState({phoneNo})}
          />
          <DatePicker
            style={{width: '80%', marginTop: 5}}
            date={this.state.dob}
            mode="date"
            format="YYYY-MM-DD"
            minDate="1947-01-01"
            maxDate="2020-05-21"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            customStyles={{
              dateIcon: {
                position: 'absolute',
                left: 0,
                top: 4,
                marginLeft: 0,
                bottom: 2,
              },
              dateInput: {
                marginLeft: 36,
                backgroundColor: '#F4F6F8',
                useNativeDriver: true,
                borderRadius: 5,
                borderColor: '#696A6B',
              },
            }}
            onDateChange={(dob) => {
              this.setState({dob: dob});
            }}
          />
          <TextInput
            label="Address"
            mode="outlined"
            style={{
              height: 35,
              width: '80%',
            }}
            theme={{
              colors: {primary: '#ff5d5b', underlineColor: 'black'},
            }}
            selectionColor="#ff5d5b"
            underlineColor="#ff5d5b"
            value={this.state.address}
            onChangeText={(address) => this.setState({address})}
            // multiline
          />
          <TextInput
            label="City"
            mode="outlined"
            style={{
              height: 35,
              width: '80%',
            }}
            theme={{
              colors: {primary: '#ff5d5b', underlineColor: 'black'},
            }}
            selectionColor="#ff5d5b"
            underlineColor="#ff5d5b"
            value={this.state.city}
            onChangeText={(city) => this.setState({city})}
          />
          <View style={styles.searchSection}>
            <TextInput
              label="Password"
              mode="outlined"
              style={{
                height: 35,
                width: '80%',
              }}
              theme={{
                colors: {
                  primary: this.state.passwordMatch ? 'green' : '#ff5d5b',
                  underlineColor: 'black',
                },
              }}
              selectionColor={this.state.passwordMatch ? 'green' : '#ff5d5b'}
              underlineColor={this.state.passwordMatch ? 'green' : '#ff5d5b'}
              value={this.state.password}
              secureTextEntry={this.state.showPassword}
              onChangeText={(password) => this.setState({password})}
            />
            <TouchableOpacity style={{position: 'absolute', top: 0, right: 5, zIndex: 1000 }} onPress={() => this.setState({ showPassword: !this.state.showPassword })}>
            <EntypoIcon
              style={styles.searchIcon}
              name="eye"
              size={30}
              color="#000"
            />
            </TouchableOpacity>
          </View>
          <TextInput
            label="Confirm Password"
            mode="outlined"
            style={{
              height: 35,
              width: '80%',
            }}
            theme={{
              colors: {
                primary: this.state.passwordMatch ? 'green' : '#ff5d5b',
                underlineColor: 'black',
              },
            }}
            selectionColor={this.state.passwordMatch ? 'green' : '#ff5d5b'}
            underlineColor={this.state.passwordMatch ? 'green' : '#ff5d5b'}
            value={this.state.confirmPassword}
            secureTextEntry
            onChangeText={(confirmPassword) => {
              this.setState({confirmPassword});
              if (this.state.password === confirmPassword) {
                this.setState({
                  passwordMatch: true,
                });
              } else {
                this.setState({
                  passwordMatch: false,
                });
              }
            }}
          />
          <View style={{paddingTop: 10}}>
            <TouchableOpacity
              style={
                this.state.loading
                  ? styles.buttonLoadingStyle
                  : styles.buttonStyle
              }
              disabled={this.state.loading}
              onPress={() => this.onButtonPress()}>
              {this.state.loading ? (
                <ActivityIndicator size="small" color="#ff5d5b" />
              ) : (
                <Text style={styles.textStyle}>Register</Text>
              )}
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={{paddingTop: Platform.OS === 'ios' ? 10 : 5}}
            onPress={() => this.props.navigation.navigate('Login')}>
            <Text style={{color: '#ff5d5b'}}>Already have an account?</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f7f7f7',
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
  searchSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchIcon: {
    padding: 10,
  },
});
