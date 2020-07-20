import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  Text,
  Image,
} from 'react-native';

export default class Contact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
    };
  }

  render() {
    return (
      <>
        <ScrollView style={styles.listView}>
          {/* <Header /> */}
          <View
            style={{
              padding: 20,
              borderRadius: 5,
              backgroundColor: '#fff',
              elevation: 5,
              margin: 5,
              paddingBottom: !this.state.visible ? 50 : 200,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={require('../../assets/img/logo.jpeg')}
              style={{width: 150, height: 150, borderRadius: 75}}
            />
            <View
              style={{
                elevation: 5,
                borderRadius: 2,
                backgroundColor: '#fff',
                padding: 5,
                width: '100%',
                marginVertical: 5,
                marginTop: 20,
              }}>
              <View style={{borderWidth: 1, borderRadius: 2, padding: 1}}>
                <View
                  style={{
                    borderWidth: 1,
                    borderRadius: 2,
                    paddingVertical: 5,
                    paddingHorizontal: 10,
                  }}>
                  <Text
                    style={{fontWeight: 'bold', fontSize: 20, marginTop: 5}}>
                    Sharjeel Asif
                  </Text>
                  <Text style={{fontSize: 15, marginTop: 10}}>
                    sharjeelasif42@gmail.com
                  </Text>
                  <Text
                    style={{
                      fontSize: 15,
                      textAlign: 'justify',
                      marginTop: 1,
                    }}
                  />
                </View>
              </View>
            </View>

            <View
              style={{
                elevation: 5,
                borderRadius: 2,
                backgroundColor: '#fff',
                padding: 5,
                width: '100%',
                marginVertical: 5,
              }}>
              <View style={{borderWidth: 1, borderRadius: 2, padding: 1}}>
                <View
                  style={{
                    borderWidth: 1,
                    borderRadius: 2,
                    paddingVertical: 5,
                    paddingHorizontal: 10,
                  }}>
                  <Text
                    style={{fontWeight: 'bold', fontSize: 20, marginTop: 5}}>
                    Awais Khan
                  </Text>
                  <Text style={{fontSize: 15, marginTop: 10}}>
                    awaism57@yahoo.com
                  </Text>
                  <Text
                    style={{
                      fontSize: 15,
                      textAlign: 'justify',
                      marginTop: 1,
                    }}
                  />
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  linearGradient: {
    flex: 0.2,
    paddingLeft: 15,
    paddingRight: 15,
  },
  profile: {
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#010E01',
  },
  userImage: {
    width: '100%',
    height: '100%',
  },
  background: {
    width: '90%',
    height: '100%',
  },
  buttonStyle: {
    backgroundColor: '#013302',
    height: 30,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#013302',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginTop: 10,
  },
  textStyle: {
    color: 'white',
  },
  listView: {
    flex: 4,
    width: '100%',
    backgroundColor: 'white',
  },
  pastPaperContainer: {
    height: 230,
    flexDirection: 'row',
    marginTop: 20,
    // elevation: 10
  },
  floatButton: {
    shadowColor: '#010E01',
    backgroundColor: '#010E01',
    opacity: 0.95,
    shadowOffset: {
      height: 4,
      width: 4,
    },
    shadowOpacity: 0.9,
    shadowRadius: 5,
    elevation: 5,
    width: Dimensions.get('window').width * 0.4,
    height: 80,
    marginHorizontal: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  heading: {
    color: '#0C6E1A',
    fontWeight: 'bold',
    fontSize: 22,
    padding: 10,
    width: '90%',
  },
  item: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
    alignSelf: 'center',
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
    alignSelf: 'center',
    marginTop: 5,
  },
  loadingStyle: {
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    height: 100,
    elevation: 1000,
    position: 'absolute',
    top: Dimensions.get('screen').height * 0.3,
  },
  loadingView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoStyle: {
    padding: 10,
    height: 110,
    width: 110,
    borderRadius: 55,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -55,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      height: 5,
      width: 2,
    },
  },
});
