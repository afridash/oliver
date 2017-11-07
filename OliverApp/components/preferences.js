import React,{Component} from 'react'
import {StyleSheet, Image, View,Text, Platform, TouchableHighlight, AsyncStorage, Share} from 'react-native'
import Button from 'react-native-button';
import theme, { styles } from 'react-native-theme'
import { Actions } from 'react-native-router-flux';
import Firebase from '../auth/firebase'
import NavBar from './navBar'
const firebase = require('firebase')
export default class Settings extends Component {
  constructor (props){
    super(props)
     this._shareMessage = this._shareMessage.bind(this);
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
  componentWillMount () {
    theme.setRoot(this)
  }
  componentWillReceiveProps () {
    this.forceUpdate()
  }
  _shareMessage() {
   Share.share({
     message: 'Download Oliver -- Exam Prep Simplified to study for your exams. Available on andriod and IOS. Get Here https://oliver.afridash.com/',
     title: 'Share Oliver'
   }, {
     dialogTitle: 'Share Oliver App',
     excludedActivityTypes: [
       'com.apple.UIKit.activity.PostToTwitter'
     ],
     tintColor: 'blue'
   })
   .then(this._showResult)
   .catch((error) => this.setState({result: 'error: ' + error.message}));
 }
render () {
  return (
    <View style={styles.container}>
      <NavBar title='Preferences' />
      <View style={customStyles.container}>
        <View style={[customStyles.menu]}>
          <View style={[customStyles.space]}>
            <Button onPress={()=>Actions.about()} style={[customStyles.secondaryContainer, styles.textColor]} >
              <Image source={require('../assets/images/info.png')} style={[customStyles.home, styles.iconColor]} /> About Us</Button>
              <View style={customStyles.iconPosition}>
              <Image source={require('../assets/images/arrow_right.png')} style={[styles.iconColor, customStyles.icon]} resizeMode={'contain'}/>
            </View>
          </View>
          <View style={[customStyles.space]}>
            <Button onPress={()=>Actions.contact()} style={[customStyles.secondaryContainer, styles.textColor]} >
              <Image source={require('../assets/images/phone.png')} style={[customStyles.home, styles.iconColor]} /> Contact Us</Button>
              <View style={customStyles.iconPosition}>
              <Image source={require('../assets/images/arrow_right.png')} style={[styles.iconColor, customStyles.icon]} resizeMode={'contain'}/>
            </View>
          </View>
          <View style={[customStyles.space]}>
            <Button onPress={this._shareMessage} style={[customStyles.secondaryContainer, styles.textColor]} >
              <Image source={require('../assets/images/heart2.png')} style={[customStyles.home, styles.iconColor]} />Share to a Friend</Button>
              <View style={customStyles.iconPosition}>
              <Image source={require('../assets/images/arrow_right.png')} style={[styles.iconColor, customStyles.icon]} resizeMode={'contain'}/>
            </View>
          </View>
              <View style={[customStyles.space]}>
                  <Button style={[customStyles.secondaryContainer, styles.textColor]} onPress={()=>Actions.themes()}><Image source={require('../assets/images/themes.png')} style={[customStyles.home, styles.iconColor]} />Themes</Button>
                  <View style={customStyles.iconPosition}>
                  <Image source={require('../assets/images/arrow_right.png')} style={[styles.iconColor, customStyles.icon]} resizeMode={'contain'}/>
                </View>
              </View>
              <View style={customStyles.logout}></View>
                <View style={{justifyContent:'center', alignItems:'center'}}>
                  <Button onPress={()=>this.logout()} style={[customStyles.secondaryContainer, styles.textColor]}>
                    <Image source={require('../assets/images/logout.png')} style={[customStyles.home, styles.iconColor]} />Logout</Button>
              </View>
        </View>
      </View>

  </View>
  )
}
}
const customStyles ={
  imageStyle:{
    marginLeft:15,
    alignSelf:'center',
    height:30,
    width:30
  },
  titleInfoStyle:{
    fontSize:16,
    color: '#8e8e93'
  },
  space:{
     flexDirection:'row',
    justifyContent:'space-between',
    borderBottomWidth:0.5,
    borderColor:'lightgrey',
  },
  logout:{
    flex:1,
     flexDirection:'row',
    justifyContent:'space-between',

  },
  listItem:{
    padding:20,
  },
  listText:{
    fontSize:18,
    fontFamily:(Platform.OS === 'ios') ? 'verdana' : 'serif',
    margin:5,
  },
  secondaryContainer:{
    fontSize: 18,
    padding:5,
    fontFamily:(Platform.OS === 'ios') ? 'verdana' : 'sans-serif',
  },
  container:{
    flex:3,
    marginTop:25,
  },

  profile:{
    flex:1,
    borderWidth:1,
    flexDirection:'row',
    borderColor:'white',
    backgroundColor:'white',
    justifyContent:'flex-start',
    alignItems:'center',
    shadowColor:'#000000',
    shadowOffset:{width: 5, height: 5},
    shadowOpacity:0.5,
    shadowRadius:5,
  },
  line:{
    justifyContent:'flex-end',
    alignItems:'center',
    borderTopWidth:3,
  },
  icon:{
    marginTop:10,
    resizeMode: 'contain',
    width: 20,
    height: 20,
    alignItems:'flex-end',
  },
  iconPosition:{
    justifyContent:'center',
    alignItems:'center'
  },
  menu:{
    flex:4,
    marginTop:10,
  },
  profileContainer:{
    width:70,
    height:70,
     borderColor:'transparent',
     borderWidth:2,
  },

  home:{
    margin: (Platform.OS === 'ios') ? 15 : 10,
    resizeMode: 'contain',
    width: 30,
    height: 30,
    alignItems:'flex-end',
  },
  profileText:{
    marginLeft: 20,
  },
  profilePicture:{
    width:70,
    height:70,
    borderColor:'transparent',
    borderRadius:35,
    borderWidth:3,
  },
  profileName:{
    color:'grey',
    fontSize:30,
  },
  profileEmail:{
    color:'grey',
    marginTop:5,
  },
  badge:{backgroundColor:'red',
  height:25, width:25,
  borderRadius:12,
  overflow:'hidden',
  flexWrap:'nowrap', flex:0,
  justifyContent:'center',
  alignItems:'center'
},
}
