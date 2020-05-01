import React, { Component } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet, KeyboardAvoidingView, ImageBackground, Dimensions, Image, Permission } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import ImagePicker from 'react-native-image-picker';
import { connect } from 'react-redux';

import * as userDetailsAction from '../../actions/UserDetailsAction';

const options = {
    title: 'Select Photo',
    takePhotoButtonTitle: "Camera",
    chooseFromLibraryButtonTitle: 'Library'
};

class Profile extends Component {

    constructor(props) {
        super(props);

        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            phoneNo: '',
            dob: '',
            password: '',
            address: '',
            weight: '',
            lastDonated: '',
            image: '',
            modal: false,
            bloodGroup: '',
            userDetails: props.userDetails
        }
    }

    componentDidMount() {
    }

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
                    image: response.data //source,base64
                });
                //console.warn(this.state.avatar)
            }
        });
    }

    render() {
        const { container, modalStyle } = styles;
        const { userDetails } = this.state;
        return (
            <KeyboardAvoidingView style={container}>
                <ScrollView style={{width: Dimensions.get('screen').width}} contentContainerStyle={{alignItems: 'center', justifyContent: 'center',}}>
                <TouchableOpacity onPress={() => this.pickImage()}>
                    <Image source={
                        (this.state.image === '') ?
                            require('../../assets/img/user.jpg') :
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
                        value={userDetails.firstName}
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
                        value={userDetails.lastName}
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
                    value={userDetails.email}
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
                    value={userDetails.phoneNo}
                    onChangeText={phoneNo => this.setState({ phoneNo })}

                />
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
                <TextInput
                    label='Blood Group'
                    mode='outlined'
                    style={styles.textInputStyle}
                    theme={{
                        colors: { primary: '#ff5d5b', underlineColor: 'black' }
                    }}
                    selectionColor='#ff5d5b'
                    underlineColor='#ff5d5b'
                    value={this.state.bloodGroup}
                    onChangeText={bloodGroup => this.setState({ bloodGroup })}
                    disabled
                />                
                <TextInput
                    label='Weight'
                    mode='outlined'
                    style={styles.textInputStyle}
                    theme={{
                        colors: { primary: '#ff5d5b', underlineColor: 'black' }
                    }}
                    selectionColor='#ff5d5b'
                    underlineColor='#ff5d5b'
                    value={this.state.weight}
                    keyboardType={"number-pad"}
                    onChangeText={weight => this.setState({ weight })}  
                    disabled                  
                />
                <TextInput
                    label='Last Donated'
                    mode='outlined'
                    style={styles.textInputStyle}
                    theme={{
                        colors: { primary: '#ff5d5b', underlineColor: 'black' }
                    }}
                    selectionColor='#ff5d5b'
                    underlineColor='#ff5d5b'
                    value={this.state.lastDonated}
                    onChangeText={lastDonated => this.setState({ lastDonated })}
                    disabled
                />
                <View style={{ paddingTop: 10 }}>
                    <Button
                        theme={{
                            colors: { primary: '#ff5d5b', underlineColor: 'black' }
                        }}
                        mode='contained'
                        onPress={() => this.props.navigation.navigate('Home')}
                    >
                        Update
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
    modalStyle: {
        position: 'absolute',
        bottom: 2,
        backgroundColor: 'white',
        width: Dimensions.get('screen').width
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
    }
})

export default connect(userDetailsAction.mapStateToProps, userDetailsAction.mapDispatchToProps)(Profile);