import React, { useEffect, useReducer } from 'react';
import { Text, View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { DrawerItemList, DrawerContentScrollView } from '@react-navigation/drawer';
import { connect } from 'react-redux';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import EntypoIcon from 'react-native-vector-icons/Entypo';

import * as userDetailsAction from '../../actions/UserDetailsAction';

const DrawerContent = (props) => {
    const userDetails = props.userDetails;

    return (<DrawerContentScrollView {...props}>
        <View style={styles.container}>
            <Image
                style={styles.imageStyle}
                source={require('../../assets/img/user.jpg')}
            />
            <View style={styles.details}>
                <Text style={styles.textStyle}>{userDetails.firstName + ' ' + userDetails.lastName}</Text>
                <View style={styles.ratings}>
                    <Text style={styles.textStyle}>{userDetails.ratings}</Text>
                    <FontAwesomeIcon
                        name="star"
                        size={20}
                        color={"#ff5d5b"}
                    />
                </View>
            </View>
        </View>
        <DrawerItemList {...props} />
        {
            (props.user === "receiver") ?
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.buttonStyle} onPress={() => props.navigation.navigate('BecomeDonor')}>
                        <EntypoIcon
                            name="drop"
                            size={20}
                            color={"#ff5d5b"}
                        />
                        <Text style={styles.buttonTextStyle}>Become a donor</Text>
                    </TouchableOpacity>
                </View> :
                null
        }
    </DrawerContentScrollView>)
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        alignItems: 'center',
        flexDirection: 'row'
    },
    details: {
        marginLeft: 10,
    },
    imageStyle: {
        height: 70,
        width: 70,
        borderRadius: 35,
    },
    textStyle: {
        paddingVertical: 10,
        fontSize: 15,
        fontWeight: 'bold',
        color: '#ff5d5b',
    },
    buttonContainer: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    buttonStyle: {
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    buttonTextStyle: {
        marginLeft: 5,
        color: '#ff5d5b',
        fontSize: 15,
        fontWeight: 'bold'
    },
    ratings: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: -15
    }
})

export default connect(userDetailsAction.mapStateToProps)(DrawerContent);