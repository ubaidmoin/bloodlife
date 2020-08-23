import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import {connect} from 'react-redux';
import {TextInput} from 'react-native-paper';
import Modal from 'react-native-modal';
import ImagePicker from 'react-native-image-picker';
import DatePicker from 'react-native-datepicker';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import firestore, {firebase} from '@react-native-firebase/firestore';
import ImageView from 'react-native-image-view';
import Communications from 'react-native-communications';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

import * as userDetailsAction from '../../actions/UserDetailsAction';

const options = {
  title: 'Select Photo',
  takePhotoButtonTitle: 'Camera',
  chooseFromLibraryButtonTitle: 'Library',
};

class EmergencyContacts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      name: '',
      number: '',
      description: '',
      emergencyContacts: [],
      searchEmergencyContacts: [],
      filter: '',
      isModalVisible: false,
      loading: false,
    };
  }

  componentDidMount() {
    firestore()
      .collection('EC')
      .onSnapshot((snapshot) => {
        let emergencyContacts = [];
        snapshot.forEach((event) => {
          emergencyContacts.push({
            id: event.id,
            name: event.data().name,
            number: event.data().number,
          });
        });
        this.setState({
          emergencyContacts: emergencyContacts,
          searchEmergencyContacts: emergencyContacts,
        });
      });
  }

  async generateEventId() {
    let id = 100;
    let response = await firestore()
      .collection('EC')
      .orderBy('id', 'desc')
      .limit(1)
      .get()
      .then((snapshot) => {
        snapshot.forEach((element) => {
          // eslint-disable-next-line radix
          id = parseInt(element.data().id.split('-')[1]);
        });
        return (id = id + 1);
      });
    return 'EC-' + response;
  }

  addEvent = (id) =>
    new Promise((resolve, reject) => {
      const {name, number} = this.state;
      if (name === '') {
        alert('Name field could not be empty');
      } else if (number === '') {
        alert('Number field could not be empty');
      } else {
        this.setState({
          loading: true,
        });
        firestore()
          .collection('EC')
          .doc(id)
          .set({
            id: id,
            name: name,
            number: number,
          })
          .then((docRef) => {
            resolve(true);
            alert('EC successfully added.');
            this.setState({
              loading: false,
              isModalVisible: false,
            });
          })
          .catch((error) => {
            reject(false);
            this.setState({
              loading: false,
              isModalVisible: false,
            });
            alert('An error occured.');
          });
      }
    });

  addNewEvent() {
    this.setState({
      isModalVisible: true,
      name: '',
      number: '',
    });
  }

  async onAddEvent() {
    let id = await this.generateEventId();
    await this.addEvent(id);
    this.setState({
      isModalVisible: false,
    });
    this.componentDidMount();
  }

  removeEvent(index) {
    let data = [...this.state.emergencyContacts];
    let item = data[index];
    firestore()
      .collection('EC')
      .doc(item.id)
      .delete()
      .then(() => alert('EC Deleted.'));
    this.setState({
      name: '',
      number: '',
      loading: false,
      id: '',
    });
  }

  filterData(data, text) {
    const filteredData = data.filter((item) => {
      const itemData = `${item.name.toUpperCase()}`;
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    return filteredData;
  }

  filterContacts(text) {
    const filteredData = this.filterData(
      this.state.searchEmergencyContacts,
      text,
    );
    this.setState({
      filter: text,
      emergencyContacts: filteredData,
    });
  }

  renderContacts(item, index) {
    const {title, phoneNo, historyTitleContainer, list} = styles;
    return (
      <View style={list}>
        <View style={historyTitleContainer}>
          <View>
            <Text style={title}>{item.name}</Text>
            <Text style={phoneNo}>Contact Number: {item.number}</Text>
          </View>
          <TouchableOpacity
            style={{justifyContent: 'center', alignItems: 'center'}}
            onPress={() => Communications.phonecall(item.number, true)}>
            <FontAwesomeIcon name="phone" size={20} color="#fff" />
            <Text style={{fontSize: 12, color: '#fff'}}>Dial</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{justifyContent: 'center', alignItems: 'center'}}
            onPress={() => this.removeContacts(index)}>
            <EntypoIcon name="cross" size={20} color="#fff" />
            <Text style={{fontSize: 12, color: '#fff'}}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  removeContacts(index) {
    let data = [...this.state.emergencyContacts];
    let item = data[index];
    firestore()
      .collection('EC')
      .doc(item.id)
      .delete()
      .then(() => {
        alert('Emergency Contact Deleted.');
        this.componentDidMount();
      });
  }

  render() {
    const {
      container,
      buttonStyle,
      textStyle,
      iconButtonStyle,
      modalButtonStyle,
      search,
    } = styles;
    const {emergencyContacts, loading} = this.state;
    return (
      <KeyboardAvoidingView behavior="padding" style={container}>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
            marginTop: 20,
          }}>
          <Text style={{fontWeight: 'bold', fontSize: 25, color: '#ff5d5b'}}>
            Emergency Contacts
          </Text>
          <TouchableOpacity
            style={iconButtonStyle}
            onPress={() => this.addNewEvent()}>
            <EntypoIcon name="plus" size={20} color="white" />
            <Text style={textStyle}>Add EC</Text>
          </TouchableOpacity>
        </View>

        <View style={container}>
          {/* <View style={search}>
            <TextInput
              label="Search"
              mode="outlined"
              style={{
                height: 40,
                width: '100%',
              }}
              theme={{
                colors: {primary: '#ff5d5b', underlineColor: 'black'},
              }}
              selectionColor="#ff5d5b"
              underlineColor="#ff5d5b"
              value={this.state.filter}
              onChangeText={(filter) => this.filterContacts(filter)}
            />
          </View> */}
          <FlatList
            data={emergencyContacts}
            keyExtractor={(contact) => contact.id + contact.name}
            renderItem={({item, index}) => this.renderContacts(item, index)}
          />
        </View>
        <Modal
          isVisible={this.state.isModalVisible}
          style={styles.modalStyle}
          scrollHorizontal
          propagateSwipe
          swipeDirection={['down']}
          onSwipeComplete={() => this.setState({isModalVisible: false})}>
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              height: '100%',
              justifyContent: 'center',
              marginTop: 30,
            }}>
            <Text style={{fontSize: 25, fontWeight: 'bold', color: '#ff5d5b'}}>
              EC Details
            </Text>
            <TextInput
              label="Name"
              mode="outlined"
              style={{
                height: 40,
                width: '80%',
              }}
              theme={{
                colors: {primary: '#ff5d5b', underlineColor: 'black'},
              }}
              selectionColor="#ff5d5b"
              underlineColor="#ff5d5b"
              value={this.state.name}
              onChangeText={(name) => this.setState({name})}
            />
            <TextInput
              label="Contact No."
              mode="outlined"
              style={{
                height: 40,
                width: '80%',
              }}
              theme={{
                colors: {primary: '#ff5d5b', underlineColor: 'black'},
              }}
              selectionColor="#ff5d5b"
              underlineColor="#ff5d5b"
              value={this.state.number}
              onChangeText={(number) => this.setState({number})}
            />
            <View
              style={{
                width: Dimensions.get('screen').width * 0.9,
                marginHorizontal: Dimensions.get('screen').width * 0.05,
                marginVertical: 10,
                elevation: 1000,
                backgroundColor: '#ffffff',
                padding: 10,
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                style={modalButtonStyle}
                onPress={() => this.onAddEvent()}
                disabled={loading}>
                {loading ? (
                  <ActivityIndicator size="small" />
                ) : (
                  <Text style={textStyle}>{'Add'.toUpperCase()}</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={modalButtonStyle}
                onPress={() =>
                  this.setState({
                    name: '',
                    number: '',
                    loading: false,
                    isModalVisible: false,
                  })
                }
                disabled={loading}>
                <Text style={textStyle}>{'cancel'.toUpperCase()}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  search: {
    width: Dimensions.get('screen').width,
    paddingHorizontal: Dimensions.get('screen').width * 0.05,
    paddingVertical: 10,
  },
  list: {
    width: Dimensions.get('screen').width * 0.9,
    padding: 10,
    marginHorizontal: Dimensions.get('screen').width * 0.05,
    // backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  historyTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#ff5d5b',
    borderRadius: 5,
    elevation: 10,
  },
  phoneNo: {
    fontSize: 15,
    color: '#fff',
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonStyle: {
    backgroundColor: '#ff5d5b',
    height: 25,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#fea39e',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  iconButtonStyle: {
    backgroundColor: '#ff5d5b',
    height: 25,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#fea39e',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    flexDirection: 'row',
  },
  textStyle: {
    color: 'white',
  },
  modalStyle: {
    borderRadius: 10,
    marginVertical: Dimensions.get('screen').height * 0.01,
    width: '100%',
    marginLeft: 0,
    backgroundColor: 'white',
    // height: '100%'
  },
  modalButtonStyle: {
    backgroundColor: '#ff5d5b',
    height: 25,
    width: 100,
    borderWidth: 1,
    borderColor: '#fea39e',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  imageStyle: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
});

export default connect(
  userDetailsAction.mapStateToProps,
  userDetailsAction.mapDispatchToProps,
)(EmergencyContacts);
