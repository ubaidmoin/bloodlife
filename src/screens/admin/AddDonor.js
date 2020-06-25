import React, { Component } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, ActivityIndicator, Dimensions, Image } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { Picker } from '@react-native-community/picker';
import DatePicker from 'react-native-datepicker';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import moment from 'moment';

import * as Validations from '../../settings/Validations';

export default class AddDonor extends Component {

    constructor(props) {
        super(props);

        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            phoneNo: '',
            address: '',
            city: '',
            dob: new Date(),
            password: '',
            weight: '',
            lastDonated: new Date(),
            image: '',
            modal: false,
            bloodGroup: 'A+',
            bloodGroupOptions: [
                { label: 'A+', value: 'A+' }, { label: 'B+', value: 'B+' }, { label: 'AB+', value: 'AB+' }, { label: 'O+', value: 'O+' },
                { label: 'A-', value: 'A-' }, { label: 'B-', value: 'B-' }, { label: 'AB-', value: 'AB-' }, { label: 'O-', value: 'O-' },
            ],
            gender: '',
            genderOptions: [
                { label: 'Male', value: 'Male' }, { label: 'Female', value: 'Female' }, { label: 'Transgender', value: 'Transgender' }
            ],
            disease: 'Yes',
            diseaseOptions: [
                { label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' }
            ],
            loading: false
        }
    }

    async generateUserId() {
        let id = 100;
        let response = await firestore()
            .collection('Users')
            .orderBy('id', 'desc').limit(1).get().then(snapshot => {
                snapshot.forEach(element => {
                    id = parseInt(element.data().id.split('-')[1])
                })
                return id = id + 1;
            });
        return "BL-" + response;
    }

    addUser = (id) => new Promise((resolve, reject) => {
        const { firstName, lastName, email, phoneNo, password, address, dob, city } = this.state;        
            firestore().collection('Users').doc(id).set({
                id: id,
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password,
                phoneNo: phoneNo,
                address: address,
                dob: dob,
                city: city,
                userType: 'donor',
                ratings: 5,
                image: this.state.image,
                weight: this.state.weight,
                lastDonated: this.state.lastDonated.toDateString(),
                gender: this.state.gender,
                bloodGroup: this.state.bloodGroup,
                disease: this.state.disease,
                blocked: false
            }).then((docRef) => {
                resolve(true);
                this.setState({
                    loading: false,
                    firstName: '',
                    lastName: '',
                    email: '',
                    phoneNo: '',
                    address: '',
                    city: '',
                    dob: new Date(),
                    password: '',
                    weight: '',
                    lastDonated: new Date(),
                    image: '',
                })

            }).catch((error) => {
                reject(false);
                this.setState({
                    loading: false,
                    firstName: '',
                    lastName: '',
                    email: '',
                    phoneNo: '',
                    address: '',
                    city: '',
                    dob: new Date(),
                    password: '',
                    weight: '',
                    lastDonated: new Date(),
                    image: '',
                })
                alert('An error occured.')
            });
    })

    componentDidMount() {
    }

    becomeDonor() {
        const { firstName, lastName, email, phoneNo, password, address, city, weight, } = this.state;
        this.setState({
            loading: true
        })
        const today = moment(new Date());
        const dob = moment(this.state.dob, 'DD-MM-YYYY').toDate();
        const years = today.diff(dob, 'years');
        if (this.state.weight === '') {
            alert('Weight field should not be empty.');
        }
        else if (!years > 18) {
            alert('You are underage to become a donor.');
        } else if (this.state.weight < '55') {
            alert('You are under-weight to become a donor.');
        } if (firstName === '') {
            alert('First Name field should not be empty.')
        } else if (lastName === '') {
            alert('Last Name field should not be empty.')
        } else if (email === '') {
            alert('Email field should not be empty.')
        } else if (!Validations.verifyEmail(email)) {
            alert('Email is invalid.')
        } else if (phoneNo === '') {
            alert('Phone Number field should not be empty.')
        } else if (!Validations.verifyPhoneNumber(phoneNo)) {
            alert('Phone Number is invalid.')
        } else if (password === '') {
            alert('Password field should not be empty.')
        } else if (address === '') {
            alert('Address field should not be empty.')
        } else if (city === '') {
            alert('City field should not be empty.')
        } else {
            auth().createUserWithEmailAndPassword(email, password)
                .then(async (doc) => {
                    const id = await this.generateUserId();
                    const user = await this.addUser(id);
                    if (user) {
                        doc.user.sendEmailVerification().then(() => alert('Verification link sent to your email.'));
                    }
                })
                .catch((error) => {
                    this.setState({
                        loading: false,
                    })
                    alert(error)
                });
        }
    }

    render() {
        const { container, selector } = styles;
        const { bloodGroupOptions, genderOptions, diseaseOptions, dob, firstName, lastName, email, phoneNo, address, image, city } = this.state;
        return (
            <KeyboardAvoidingView style={container}>
                <ScrollView style={{ width: Dimensions.get('screen').width }} contentContainerStyle={{ alignItems: 'center', justifyContent: 'center', }}>
                    <Image source={
                        (image === '') ?
                            require('../../assets/img/user.jpg') :
                            { uri: 'data:image/jpeg;base64,' + image }
                    }
                        style={styles.imageStyle}
                    />
                    <View style={{ flexDirection: 'row', }}>
                        <TextInput
                            label='First Name'
                            mode='outlined'
                            style={{
                                height: 40,
                                width: '39%',
                            }}
                            theme={{
                                colors: { primary: '#ff5d5b', underlineColor: 'black' }
                            }}
                            selectionColor='#ff5d5b'
                            underlineColor='#ff5d5b'
                            value={firstName}
                            onChangeText={firstName => this.setState({ firstName })}                            
                        />
                        <TextInput
                            label='Last Name'
                            mode='outlined'
                            style={{
                                height: 40,
                                width: '39%',
                                marginLeft: '2%'
                            }}
                            theme={{
                                colors: { primary: '#ff5d5b', underlineColor: 'black' }
                            }}
                            selectionColor='#ff5d5b'
                            underlineColor='#ff5d5b'
                            value={lastName}
                            onChangeText={lastName => this.setState({ lastName })}                            
                        /></View>
                    <TextInput
                        label='Email'
                        mode='outlined'
                        style={styles.textInputStyle}
                        theme={{
                            colors: { primary: '#ff5d5b', underlineColor: 'black' }
                        }}
                        selectionColor='#ff5d5b'
                        underlineColor='#ff5d5b'
                        value={email}
                        onChangeText={email => this.setState({ email })}                        
                    />
                    <TextInput
                        label='Phone No.'
                        mode='outlined'
                        style={styles.textInputStyle}
                        theme={{
                            colors: { primary: '#ff5d5b', underlineColor: 'black' }
                        }}
                        selectionColor='#ff5d5b'
                        underlineColor='#ff5d5b'
                        value={phoneNo}
                        onChangeText={phoneNo => this.setState({ phoneNo })}

                    />
                    <View style={selector}>
                        <Picker
                            selectedValue={this.state.gender}
                            style={{ width: '100%' }}
                            onValueChange={(itemValue, itemIndex) =>
                                this.setState({ gender: itemValue })
                            }>
                            {
                                genderOptions.map((item, index) =>
                                    <Picker.Item key={index} label={item.label} value={item.value} />
                                )
                            }
                        </Picker>
                    </View>
                    <DatePicker
                        style={{ width: '80%', marginVertical: 10 }}
                        date={dob}
                        mode="date"
                        format="YYYY-MM-DD"
                        minDate="1947-01-01"
                        maxDate="2020-06-20"
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
                                useNativeDriver: true
                            }
                            // ... You can check the source to find the other keys.
                        }}
                        onDateChange={(dob) => { this.setState({ dob: dob }) }}
                    >
                        {/* <Text>Select Date of Birth</Text> */}
                    </DatePicker>
                    <TextInput
                        label='Address'
                        mode='outlined'
                        style={styles.textInputStyle}
                        theme={{
                            colors: { primary: '#ff5d5b', underlineColor: 'black' }
                        }}
                        selectionColor='#ff5d5b'
                        underlineColor='#ff5d5b'
                        value={address}
                        onChangeText={address => this.setState({ address })}
                    />
                    <TextInput
                        label='City'
                        mode='outlined'
                        style={styles.textInputStyle}
                        theme={{
                            colors: { primary: '#ff5d5b', underlineColor: 'black' }
                        }}
                        selectionColor='#ff5d5b'
                        underlineColor='#ff5d5b'
                        value={city}
                        onChangeText={city => this.setState({ city })}
                    />
                    <View style={selector}>
                        <Picker
                            selectedValue={this.state.bloodGroup}
                            style={{ width: '100%' }}
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
                    <TextInput
                        label='Weight'
                        mode='outlined'
                        style={styles.textInputStyle}
                        theme={{
                            colors: { primary: '#ff5d5b', underlineColor: 'black' }
                        }}
                        selectionColor='#ff5d5b'
                        underlineColor='#ff5d5b'
                        keyboardType={"number-pad"}
                        value={this.state.weight}
                        onChangeText={weight => this.setState({ weight })}
                    />
                    <View style={selector}>
                        <Text style={{ color: '#ff5d5b', fontSize: 15, fontWeight: 'bold' }}>
                            Got any disease?
                    </Text>
                        <Picker
                            selectedValue={this.state.disease}
                            style={{ width: '100%' }}
                            onValueChange={(itemValue, itemIndex) =>
                                this.setState({ disease: itemValue })
                            }>
                            {
                                diseaseOptions.map((item, index) =>
                                    <Picker.Item key={index} label={item.label} value={item.value} />
                                )
                            }
                        </Picker>
                    </View>
                    <DatePicker
                        style={{ width: '80%', marginVertical: 10 }}
                        date={this.state.lastDonated}
                        mode="date"
                        format="YYYY-MM-DD"
                        minDate="2019-01-01"
                        maxDate="2020-06-20"
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
                                useNativeDriver: true
                            }
                            // ... You can check the source to find the other keys.
                        }}
                        onDateChange={(dob) => { this.setState({ lastDonated: dob }) }}
                    >
                        {/* <Text>Select Date of Birth</Text> */}
                    </DatePicker>
                    <View style={{ paddingTop: 10, paddingBottom: 10 }}>
                        <TouchableOpacity
                            style={(this.state.loading) ? styles.buttonLoadingStyle : styles.buttonStyle}
                            disabled={this.state.loading}
                            onPress={() => this.becomeDonor()}
                        >
                            {(this.state.loading) ?
                                <ActivityIndicator size="small" color="#ff5d5b" /> :
                                <Text style={styles.textStyle}>
                                    {'Register donor'.toUpperCase()}
                                </Text>
                            }
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        );
    }
}

const buttonTheme = {
    colors: {
        primary: "#ff5d5b",
        accent: "#ff5d5b"
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    modalButton: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10
    },
    imageStyle: {
        width: 100,
        height: 100,
        backgroundColor: 'lightgrey',
        borderRadius: 50
    },
    textInputStyle: {
        height: 40,
        width: '80%',
    },
    selector: {
        width: '80%',
        marginTop: 5
    },
    textStyle: {
        color: 'white'
    },
    buttonStyle: {
        backgroundColor: '#ff5d5b',
        height: 30,
        paddingHorizontal: 20,
        borderWidth: 1,
        borderColor: '#fea39e',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5
    },
    buttonLoadingStyle: {
        backgroundColor: '#ffffff',
        height: 30,
        paddingHorizontal: 20,
        borderWidth: 1,
        borderColor: '#fea39e',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5
    }
})