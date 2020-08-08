import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
  Image,
} from 'react-native';
import {connect} from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import Lightbox from 'react-native-lightbox';
import ImageView from 'react-native-image-view';

import * as userDetailsAction from '../../actions/UserDetailsAction';
const WINDOW_WIDTH = Dimensions.get('window').width;
const BASE_PADDING = 10;

// const renderCarousel = () => (
//     <Carousel style={{ width: WINDOW_WIDTH, height: WINDOW_WIDTH }}>
//       <Image
//         style={{ flex: 1 }}
//         resizeMode="contain"
//         source={{ uri: 'http://cdn.lolwot.com/wp-content/uploads/2015/07/20-pictures-of-animals-in-hats-to-brighten-up-your-day-1.jpg' }}
//       />
//       <View style={{ backgroundColor: '#6C7A89', flex: 1 }}/>
//       <View style={{ backgroundColor: '#019875', flex: 1 }}/>
//       <View style={{ backgroundColor: '#E67E22', flex: 1 }}/>
//     </Carousel>
//   )

class Event extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      isImageViewVisible: false,
      imageIndex: 0,
    };
  }

  componentDidMount() {
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
        {/* <Lightbox >
                        <Image
                            resizeMode="center"
                            source={(item.image === '') ?
                                require('../../assets/img/user.jpg') :
                                { uri: 'data:image/jpeg;base64,' + item.image }} style={image} />
                    </Lightbox> */}
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
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 5,
              marginTop: -8,
              backgroundColor: 'white',
              borderRadius: 5,
            }}>
            <View style={{flexDirection: 'row', marginLeft: 10, width: '100%'}}>
              <Text style={{fontSize: 15, width: '100%'}}>
                {item.description}
              </Text>
            </View>
          </View>
        ) : null}
      </View>
    );
  }

  render() {
    const {container} = styles;
    const {events} = this.state;
    return (
      <View style={container}>
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
            onClose={() => this.setState({isImageViewVisible: false})}
            imageIndex={0}
            isVisible={this.state.isImageViewVisible}
          />
        )}
      </View>
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
    borderRadius: 5,
    backgroundColor: '#ffffff',
    padding: 10,
  },
  image: {
    height: 150,
    width: '100%',
  },
  fullImage: {
    width: '100%',
    height: 150,
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
  },
  eventDate: {
    fontSize: 15,
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
  textStyle: {
    color: 'white',
  },
  imageStyle: {
    width: 100,
    height: 100,
    backgroundColor: 'lightgrey',
    borderRadius: 50,
  },
});

export default connect(
  userDetailsAction.mapStateToProps,
  userDetailsAction.mapDispatchToProps,
)(Event);
