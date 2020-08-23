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

import * as userDetailsAction from '../../actions/UserDetailsAction';

const options = {
  title: 'Select Photo',
  takePhotoButtonTitle: 'Camera',
  chooseFromLibraryButtonTitle: 'Library',
};

class Event extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      id: '',
      name: '',
      date: new Date(),
      description: '',
      image: '',
      isModalVisible: false,
      loading: false,
      isImageViewVisible: false,
      imageIndex: 0,
      minDate:
        new Date().getFullYear() +
        '-' +
        (new Date().getMonth() + 1) +
        '-' +
        new Date().getDate(),
      modify: false,
      dateChanged: false,
    };
  }

  componentDidMount() {
    console.log(this.state.date.toDateString());
    firestore()
      .collection('Events')
      .onSnapshot((snapshot) => {
        let events = [];
        snapshot.forEach((event) => {
          events.push({
            id: event.id,
            name: event.data().name,
            date: event.data().date,
            description: event.data().description,
            image: event.data().image,
          });
        });
        this.setState({
          events,
        });
      });
  }

  async generateEventId() {
    let id = 100;
    let response = await firestore()
      .collection('Events')
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
    return 'EVENT-' + response;
  }

  addEvent = (id) =>
    new Promise((resolve, reject) => {
      const {name, description, image} = this.state;
      let date = '';
      date = this.state.dateChanged
        ? this.state.date
        : this.state.date.toDateString();
      if (name === '') {
        alert('Name field could not be empty');
      } else if (description === '') {
        alert('Description field could not be empty');
      } else if (image === '') {
        alert('Please select image');
      } else {
        this.setState({
          loading: true,
        });
        firestore()
          .collection('Events')
          .doc(id)
          .set({
            id: id,
            name: name,
            date: date,
            description: description,
            image: image,
          })
          .then((docRef) => {
            resolve(true);
            alert('Event successfully added.');
            this.setState({
              loading: false,
              isModalVisible: false,
              dateChanged: false,
            });
          })
          .catch((error) => {
            reject(false);
            this.setState({
              loading: false,
              isModalVisible: false,
              dateChanged: false,
            });
            alert('An error occured.');
          });
      }
    });

  addNewEvent() {
    this.setState({
      isModalVisible: true,
      modify: false,
      dateChanged: false,
      name: '',
      description: '',
      date: new Date(),
      image: '',
    });
  }

  async onAddEvent() {
    console.log(this.state.dateChanged);
    if (this.state.modify) {
      firestore()
        .collection('Events')
        .doc(this.state.id)
        .update({
          name: this.state.name,
          description: this.state.description,
          image: this.state.image,
          date: this.state.dateChanged
            ? this.state.date
            : this.state.date.toDateString(),
        })
        .then(() => {
          this.setState({
            isModalVisible: false,
            dateChanged: false,
            name: '',
            description: '',
            date: new Date(),
            image: '',
          });
        });
    } else {
      let id = await this.generateEventId();
      this.addEvent(id);
    }
  }

  pickImageFromCamera() {
    ImagePicker.launchCamera(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        //const source = { uri: response.uri };
        console.log(response.uri);
        // You can also display the image using data:
        //let source = {  response.data };//already added this thing

        this.setState({
          image: response.data, //source,base64
        });
        //console.warn(this.state.avatar)
      }
    });
  }

  pickImageFromLibrary() {
    ImagePicker.launchImageLibrary(options, (response) => {
      console.log(response.customButton);
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        //const source = { uri: response.uri };
        console.log(response.uri);
        // You can also display the image using data:
        //let source = {  response.data };//already added this thing

        this.setState({
          image: response.data, //source,base64
        });
        //console.warn(this.state.avatar)
      }
    });
  }

  showDescription(index) {
    let data = [...this.state.events];
    let item = data[index];
    item.showDescription = !item.showDescription;
    data.forEach((element) => {
      if (element.id !== item.id) {
        element.showDescription = false;
      }
    });
    this.setState({events: data});
  }

  removeEvent(index) {
    let data = [...this.state.events];
    let item = data[index];
    firestore()
      .collection('Events')
      .doc(item.id)
      .delete()
      .then(() => alert('Event Deleted.'));
    this.setState({
      name: '',
      description: '',
      dateChanged: false,
      date: new Date(),
      image: '',
      id: '',
    });
  }

  modifyEvent(index) {
    let data = [...this.state.events];
    let item = data[index];
    this.setState({
      isModalVisible: true,
      name: item.name,
      description: item.description,
      image: item.image,
      date: new Date(item.date),
      id: item.id,
      modify: true,
    });
  }

  renderEvents(item, index) {
    const {
      event,
      image,
      eventTitle,
      eventName,
      eventDate,
      buttonStyle,
      textStyle,
    } = styles;
    return (
      <View style={event} key={index}>
        <TouchableOpacity
          onPress={() => {
            this.setState({
              isImageViewVisible: true,
              imageIndex: index,
            });
          }}>
          <Image
            style={{width: '100%', height: 150}}
            source={
              item.image === ''
                ? require('../../assets/img/user.jpg')
                : {uri: 'data:image/jpeg;base64,' + item.image}
            }
            resizeMode="cover"
          />
        </TouchableOpacity>
        <View style={eventTitle}>
          <View>
            <Text style={eventName}>{item.name}</Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: Dimensions.get('window').width * 0.8,
              }}>
              <Text style={eventDate}>{item.date}</Text>
              <TouchableOpacity
                style={buttonStyle}
                onPress={() => this.showDescription(index)}>
                <Text style={textStyle}>
                  {item.showDescription
                    ? 'show less'.toUpperCase()
                    : 'show more'.toUpperCase()}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {item.showDescription === true ? (
          <View
            style={{
              alignItems: 'center',
              marginBottom: 5,
              marginTop: -8,
              backgroundColor: 'white',
              borderRadius: 5,
            }}>
            <View style={{flexDirection: 'row', marginLeft: 20, width: '100%'}}>
              <Text style={{fontSize: 15, width: '100%'}}>
                {item.description}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                justifyContent: 'space-evenly',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                style={buttonStyle}
                onPress={() => this.modifyEvent(index)}>
                <Text style={textStyle}>{'modify'.toUpperCase()}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={buttonStyle}
                onPress={() => this.removeEvent(index)}>
                <Text style={textStyle}>{'remove'.toUpperCase()}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
      </View>
    );
  }

  render() {
    const {
      container,
      buttonStyle,
      textStyle,
      iconButtonStyle,
      modalButtonStyle,
    } = styles;
    const {events, loading} = this.state;
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
            Events
          </Text>
          <TouchableOpacity
            style={iconButtonStyle}
            onPress={() => this.addNewEvent()}>
            <EntypoIcon name="plus" size={20} color="white" />
            <Text style={textStyle}>Add Event</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={events}
          keyExtractor={(event) => event.id + event.name}
          renderItem={({item, index}) => this.renderEvents(item, index)}
        />
        {events.length > 0 && (
          <ImageView
            images={[
              {
                source:
                  events[this.state.imageIndex].image === ''
                    ? require('../../assets/img/user.jpg')
                    : {
                        uri:
                          'data:image/jpeg;base64,' +
                          events[this.state.imageIndex].image,
                      },
                width: 806,
                height: 720,
              },
            ]}
            onClose={() =>
              this.setState({isImageViewVisible: false, imageIndex: 0})
            }
            imageIndex={0}
            isVisible={this.state.isImageViewVisible}
          />
        )}
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
              Event Details
            </Text>
            <View style={{marginTop: 15, alignSelf: 'center'}}>
              <TouchableOpacity
              // onPress={() => this.pickImage()}
              >
                <Image
                  source={
                    this.state.image === ''
                      ? require('../../assets/img/add.png')
                      : {uri: 'data:image/jpeg;base64,' + this.state.image}
                  }
                  style={styles.imageStyle}
                />
              </TouchableOpacity>
            </View>
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
                style={{
                  backgroundColor: '#ff5d5b',
                  height: 25,
                  width: 150,
                  borderWidth: 1,
                  borderColor: '#fea39e',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 5,
                }}
                onPress={() => this.pickImageFromCamera()}>
                <Text style={textStyle}>Take from Camera</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: '#ff5d5b',
                  height: 25,
                  width: 150,
                  borderWidth: 1,
                  borderColor: '#fea39e',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 5,
                }}
                onPress={() => this.pickImageFromLibrary()}
                disabled={loading}>
                <Text style={textStyle}>Select from Library</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              label="Event Name"
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
              label="Event Description"
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
              value={this.state.description}
              onChangeText={(description) => this.setState({description})}
            />
            <DatePicker
              style={{width: '80%', marginTop: 5}}
              date={this.state.date}
              mode="date"
              format="YYYY-MM-DD"
              minDate={this.state.minDate}
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
                  borderWidth: 0,
                },
              }}
              onDateChange={(date) => {
                this.setState({
                  date: date,
                  dateChanged: true,
                });
              }}
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
                  <Text style={textStyle}>
                    {this.state.modify
                      ? 'update'.toUpperCase()
                      : 'Add'.toUpperCase()}
                  </Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={modalButtonStyle}
                onPress={() =>
                  this.setState({
                    isModalVisible: false,
                    modify: false,
                    dateChanged: false,
                    name: '',
                    description: '',
                    date: new Date(),
                    image: '',
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
  },
  event: {
    width: Dimensions.get('screen').width * 0.9,
    marginHorizontal: Dimensions.get('screen').width * 0.05,
    marginVertical: 10,
    elevation: 10,
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 5,
  },
  image: {
    width: '100%',
    height: 130,
  },
  eventTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  eventName: {
    fontWeight: 'bold',
    fontSize: 25,
    width: Dimensions.get('window').width * 0.5,
  },
  eventDate: {
    fontSize: 15,
    width: Dimensions.get('window').width * 0.5,
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
    width: 150,
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
)(Event);
