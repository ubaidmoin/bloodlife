import React, { Component } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, ImageBackground, Dimensions, Image } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { Picker } from '@react-native-community/picker';
import DatePicker from 'react-native-datepicker';
import { connect } from 'react-redux';

import * as userDetailsAction from '../actions/UserDetailsAction';

class BecomeDonor extends Component {

    constructor(props) {
        super(props);

        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            phoneNo: '',
            address: '',
            dob: '',
            password: '',
            weight: '',
            lastDonated: new Date(),
            image: '',
            modal: false,
            bloodGroup: '',
            bloodGroupOptions: [
                { label: 'A+', value: 'A+' }, { label: 'B+', value: 'B+' }, { label: 'AB+', value: 'AB+' }, { label: 'O+', value: 'O+' },
                { label: 'A-', value: 'A-' }, { label: 'B-', value: 'B-' }, { label: 'AB-', value: 'AB-' }, { label: 'O-', value: 'O-' },
            ],
            gender: '',
            genderOptions: [
                { label: 'Male', value: 'Male' }, { label: 'Female', value: 'Female' }, { label: 'Transgender', value: 'Transgender' }
            ],
            disease: '',
            diseaseOptions: [
                { label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' }
            ]
        }
    }

    componentDidMount() {
    }

    render() {
        const { container, selector } = styles;
        const { bloodGroupOptions, genderOptions, diseaseOptions } = this.state;
        return (
            <KeyboardAvoidingView style={container}>
                <ScrollView style={{width: Dimensions.get('screen').width}} contentContainerStyle={{alignItems: 'center', justifyContent: 'center',}}>
                    <TouchableOpacity onPress={() => this.pickImage()}>
                        <Image source={
                            (this.state.image === '') ?
                                require('../assets/img/user.jpg') :
                                { uri: 'data:image/jpeg;base64,' + this.state.image }
                        }
                            style={styles.imageStyle}
                        />
                    </TouchableOpacity>
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
                            value={this.state.firstName}
                            onChangeText={firstName => this.setState({ firstName })}
                            disabled={true}
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
                            value={this.state.lastName}
                            onChangeText={lastName => this.setState({ lastName })}
                            disabled
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
                        value={this.state.email}
                        onChangeText={email => this.setState({ email })}
                        disabled
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
                        value={this.state.phoneNo}
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
                    <TextInput
                        label='Date of Birth'
                        mode='outlined'
                        style={styles.textInputStyle}
                        theme={{
                            colors: { primary: '#ff5d5b', underlineColor: 'black' }
                        }}
                        selectionColor='#ff5d5b'
                        underlineColor='#ff5d5b'
                        value={this.state.dob}
                        disabled
                    />
                    <TextInput
                        label='Address'
                        mode='outlined'
                        style={{
                            height: 60,
                            width: '80%',
                        }}
                        theme={{
                            colors: { primary: '#ff5d5b', underlineColor: 'black' }
                        }}
                        selectionColor='#ff5d5b'
                        underlineColor='#ff5d5b'
                        value={this.state.address}
                        onChangeText={address => this.setState({ address })}
                        multiline
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
                        minDate="1947-01-01"
                        maxDate="2020-02-01"
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
                    <View style={{ paddingTop: 10 }}>
                        <Button
                            theme={buttonTheme}
                            mode='contained'
                            onPress={() => this.props.navigation.navigate('Home')}
                        >
                            Become Donor
                        </Button>
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
    }
})

export default connect(userDetailsAction.mapStateToProps, userDetailsAction.mapDispatchToProps)(BecomeDonor);