import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  Text,
  TouchableOpacity,
  Linking,
} from 'react-native';

export default class Privacy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
    };
  }

  render() {
    return (
      <>
        <View style={styles.listView}>
          {/* <Header /> */}
          <ScrollView
            style={{
              padding: 20,
              borderRadius: 5,
              backgroundColor: '#fff',
              elevation: 100,
              margin: 5,
              paddingBottom: !this.state.visible ? 50 : 200,
              paddingBottom: 40,
            }}>
            <Text style={{fontSize: 20, fontWeight: 'bold'}}>
              Privacy Policy
            </Text>
            <Text style={{textAlign: 'justify'}}>
              Sharjeel Asif and M.Awais built the Umeed-e-Noa Blood App app as a
              Free app. This SERVICE is provided by Sharjeel Asif and M.Awais at
              no cost and is intended for use as is. This page is used to inform
              visitors regarding my policies with the collection, use, and
              disclosure of Personal Information if anyone decided to use my
              Service. If you choose to use my Service, then you agree to the
              collection and use of information in relation to this policy. The
              Personal Information that I collect is used for providing and
              improving the Service. I will not use or share your information
              with anyone except as described in this Privacy Policy. The terms
              used in this Privacy Policy have the same meanings as in our Terms
              and Conditions, which is accessible at Umeed-e-Noa Blood App
              unless otherwise defined in this Privacy Policy.
            </Text>
            <View>
              <View style={{marginTop: 20}}>
                <Text style={{fontSize: 15, fontWeight: 'bold'}}>
                  Information Collection and Use
                </Text>
                <Text style={{textAlign: 'justify'}}>
                  For a better experience, while using our Service, I may
                  require you to provide us with certain personally identifiable
                  information, including but not limited to camera access,
                  gallery or photos access , location access and Google location
                  service. . The information that I request will be retained on
                  your device and is not collected by me in any way. The app
                  does use third party services that may collect information
                  used to identify you. Link to privacy policy of third party
                  service providers used by the app.{'\n'}
                  <Text>· Google Play Services{'\n'}</Text>
                  <Text>· Google Analytics for Firebase{'\n'}</Text>
                  <Text>· Firebase Crashlytics</Text>
                </Text>
              </View>
              <View style={{marginTop: 20}}>
                <Text style={{fontSize: 15, fontWeight: 'bold'}}>Log Data</Text>
                <Text style={{textAlign: 'justify'}}>
                  I want to inform you that whenever you use my Service, in a
                  case of an error in the app I collect data and information
                  (through third party products) on your phone called Log Data.
                  This Log Data may include information such as your device
                  Internet Protocol (“IP”) address, device name, operating
                  system version, the configuration of the app when utilizing my
                  Service, the time and date of your use of the Service, and
                  other statistics.
                </Text>
              </View>
              <View style={{marginTop: 20}}>
                <Text style={{fontSize: 15, fontWeight: 'bold'}}>Cookies</Text>
                <Text style={{textAlign: 'justify'}}>
                  Cookies are files with a small amount of data that are
                  commonly used as anonymous unique identifiers. These are sent
                  to your browser from the websites that you visit and are
                  stored on your device's internal memory.{'\n'}
                  This Service does not use these “cookies” explicitly. However,
                  the app may use third party code and libraries that use
                  “cookies” to collect information and improve their services.
                  You have the option to either accept or refuse these cookies
                  and know when a cookie is being sent to your device. If you
                  choose to refuse our cookies, you may not be able to use some
                  portions of this Service.
                </Text>
              </View>
              <View style={{marginTop: 20}}>
                <Text style={{fontSize: 15, fontWeight: 'bold'}}>
                  Service Providers
                </Text>
                <Text style={{textAlign: 'justify'}}>
                  I may employ third-party companies and individuals due to the
                  following reasons:{'\n'}· To facilitate our Service;{'\n'}· To
                  provide the Service on our behalf;{'\n'}· To perform
                  Service-related services; or{'\n'}· To assist us in analyzing
                  how our Service is used.{'\n'}I want to inform users of this
                  Service that these third parties have access to your Personal
                  Information. The reason is to perform the tasks assigned to
                  them on our behalf. However, they are obligated not to
                  disclose or use the information for any other purpose.
                </Text>
              </View>
              <View style={{marginTop: 20}}>
                <Text style={{fontSize: 15, fontWeight: 'bold'}}>Security</Text>
                <Text style={{textAlign: 'justify'}}>
                  I value your trust in providing us your Personal Information,
                  thus we are striving to use commercially acceptable means of
                  protecting it. But remember that no method of transmission
                  over the internet, or method of electronic storage is 100%
                  secure and reliable, and I cannot guarantee its absolute
                  security.
                </Text>
              </View>
              <View style={{marginTop: 20}}>
                <Text style={{fontSize: 15, fontWeight: 'bold'}}>
                  Links to Other Sites
                </Text>
                <Text style={{textAlign: 'justify'}}>
                  This Service may contain links to other sites. If you click on
                  a third-party link, you will be directed to that site. Note
                  that these external sites are not operated by me. Therefore, I
                  strongly advise you to review the Privacy Policy of these
                  websites. I have no control over and assume no responsibility
                  for the content, privacy policies, or practices of any
                  third-party sites or services.
                </Text>
              </View>
              <View style={{marginTop: 20}}>
                <Text style={{fontSize: 15, fontWeight: 'bold'}}>
                  Children’s Privacy
                </Text>
                <Text style={{textAlign: 'justify'}}>
                  These Services do not address anyone under the age of 13. I do
                  not knowingly collect personally identifiable information from
                  children under 13. In the case I discover that a child under
                  13 has provided me with personal information, I immediately
                  delete this from our servers. If you are a parent or guardian
                  and you are aware that your child has provided us with
                  personal information, please contact me so that I will be able
                  to do necessary actions.
                </Text>
              </View>
              <View style={{marginTop: 20}}>
                <Text style={{fontSize: 15, fontWeight: 'bold'}}>
                  Changes to This Privacy Policy
                </Text>
                <Text style={{textAlign: 'justify'}}>
                  I may update our Privacy Policy from time to time. Thus, you
                  are advised to review this page periodically for any changes.
                  I will notify you of any changes by posting the new Privacy
                  Policy on this page.{'\n'}
                  This policy is effective as of 2020-08-19
                </Text>
              </View>
              <View style={{marginTop: 20, marginBottom: 30}}>
                <Text style={{fontSize: 15, fontWeight: 'bold'}}>
                  Contact Us
                </Text>
                <Text style={{textAlign: 'justify'}}>
                  If you have any questions or suggestions about my Privacy
                  Policy, do not hesitate to contact me at
                  sharjeelasif42@gmail.com awaism57@yahoo.com.{'\n'}
                  This privacy policy page was created at
                  privacypolicytemplate.net and modified/generated by App
                  Privacy Policy Generator.
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL(
                      'https://docs.google.com/document/d/13B_5eshi9hvKl5NDNo7q-UNbJap0aqSmNzPRGVoutMM/edit?usp=drivesdk',
                    )
                  }>
                  <Text style={{ color: 'blue', textAlign: 'justify', textDecorationLine: 'underline' }}>
                    https://docs.google.com/document/d/13B_5eshi9hvKl5NDNo7q-UNbJap0aqSmNzPRGVoutMM/edit?usp=drivesdk
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
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
