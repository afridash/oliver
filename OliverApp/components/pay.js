import React from 'react';
import {
  StyleSheet,
  Text,
  View ,
  Image,
  TouchableHighlight,
  Alert,
  Platform,
  Linking,
  AsyncStorage
} from 'react-native';
import {Actions} from 'react-native-router-flux'
import Firebase from '../auth/firebase'
const firebase = require('firebase')
import theme, { styles } from 'react-native-theme'
import Button from 'react-native-button'
export default class Pay extends React.Component {
  constructor (props) {
    super (props)
    this.state = {
      isLoading:false,
      pin:''
    }
  }
  componentWillMount () {
    theme.setRoot(this)
  }
  loadPay () {
    return Linking.openURL("https://oliver.afridash.com")
  }
  async logout () {
    firebase.auth().signOut().then(function () {
      // Sign-out successful.
      }, function (error) {
        // An error happened.
    })
    var current = await AsyncStorage.getItem('myKey')
    AsyncStorage.setItem('currentUser', current)
    let keys = ['email', 'myKey', 'name', 'pPicture', 'verified', 'collegeId', 'college', 'username']
    await AsyncStorage.multiRemove(keys, (err) => {
      return Actions.reset('index')
    })
  }
  render() {
    return (
      <View
      style={styles.container}
    >
        <View style={customStyles.title}></View>
          <View style={{flex:1, height:50}}></View>
        <View style={customStyles.secondaryContainer}>
          <View style={customStyles.box}>
            <View style={customStyles.emailDIV}>
              <Text style={{fontSize:16}}>Your annual subscription has expired. Please log in to your account on our web platform to make payments. </Text>
            </View>
          </View>
          <Button onPress={()=>this.loadPay()} style={[styles.primaryButton, customStyles.signupButton,customStyles.primaryButton]}>Pay Now</Button>
         </View>
         <View style={customStyles.title}><Text onPress={()=>this.logout()} style={[customStyles.header, styles.header]}>Log Out</Text></View>
         <View style={customStyles.title}></View>
       </View>
    );
  }
}

const customStyles = StyleSheet.create({
  secondaryContainer: {
    flex:2,
    shadowColor:'#000000',
    shadowOffset:{width: 10, height: 10},
    shadowOpacity:0.5,
    shadowRadius:5,
    borderWidth:2,
    borderColor:'white',
    margin:40,
    backgroundColor:'white',
    borderRadius:10,
  },
  emailDIV: {
    flex: 3,
    flexDirection: 'row',
    height:150,
    borderColor: '#C8C8C8',
    borderBottomWidth: (Platform.OS === 'ios') ? 1 : 0,
  },
  title: {
    flex:2,
    justifyContent:'center',
    alignItems:'center',
  },
  header:{
    fontSize:18,
    textDecorationLine:'underline',
    textDecorationColor:'white',
    fontFamily:(Platform.OS === 'ios') ? 'verdana' : 'serif',
    color:'#fafafa',
    backgroundColor:'transparent'
  },
  box: {
    flex:2,
    flexDirection:'column',
    alignItems:'center',
    justifyContent:'center',
  },
  signupButton: {
    borderWidth:2,
    borderRadius:10,
  },
  primaryButton: {
    fontSize:20,
    padding:10,
    textAlign:'center',
    color:'white',
    fontFamily:(Platform.OS === 'ios') ? 'verdana' : 'serif',
    margin:5,
    borderColor:'#fafafa',
  },
});
