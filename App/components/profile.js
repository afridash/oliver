import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, ViewPropTypes, Platform, Image, AsyncStorage,TouchableHighlight } from 'react-native';
import Button from 'react-native-button';
import { Actions } from 'react-native-router-flux';
import theme, { styles } from 'react-native-theme'
import {ImagePicker} from 'expo'
import Firebase from '../auth/firebase'
const firebase = require('firebase')
import b64 from 'base64-js'
import NavBar from './navBar'

export default class Profile extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      email:'',
      college:'',
      username:'',
      profilePicture:'none'
    }
  }
  async componentWillMount () {
    theme.setRoot(this)
    var email = await AsyncStorage.getItem('email')
    var profilePicture = await AsyncStorage.getItem('pPicture')
    var college = await AsyncStorage.getItem('college')
    var username = await AsyncStorage.getItem('username')
   this.setState({email, college, username,profilePicture})
  }
  readAddCourses() {
    this.data = []
    this.setState({users:[]})
    firebase.database().ref().child('users').child(this.state.userId).once('value', (snapshot)=>{
      snapshot.forEach((course)=>{
        this.data.push({key:course.key, show:false, email:course.val().email, college:course.val().college, username:course.val().username})
        this.setState({data:this.data})
      })
    })
  }
  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      base64:true,
    })
    if(!result.cancelled){
      const byteArray = b64.toByteArray(result.base64)
      const metadata = {contentType: 'image/jpeg'}
      this.setState({profilePicture:result.uri})
      var user = firebase.auth().currentUser
      var ref = firebase.storage().ref().child('users').child('profilePictures').child(user.uid)
      ref.put(byteArray, metadata).then(this.savePictureOnline.bind(this))
      AsyncStorage.setItem('pPicture', result.uri)
    }
  }
  savePictureOnline (snapshot) {
    var user = firebase.auth().currentUser
    if (user) {
      user.updateProfile({
        photoURL: snapshot.downloadURL,
      }).then(function(){
        console.log('Uploaded')
      })
      firebase.database().ref().child('users').child(user.uid).update({
        profilePicture: snapshot.downloadURL,
      })
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <NavBar title='Profile' />
        <View style={customStyles.container}>
          <View style={{flex:3, backgroundColor:'transparent'}}>
            <Image resizeMode={'cover'}  source={{uri: this.state.profilePicture}} style={customStyles.profile} blurRadius={20} >
            <View style={{flex:1}}>
              <View style={customStyles.profileContainer}>
                  <TouchableHighlight onPress={Actions.view} underlayColor={'transparent'}>
                    <Image resizeMode={'cover'}  source={{uri: this.state.profilePicture}} style={customStyles.profilePicture} />
                  </TouchableHighlight>
           </View>
           <View style={{flex:0.1, alignItems:'flex-end', justifyContent:'flex-end'}}>
             <View style={{flex:1, flexDirection:'row'}}>
               <TouchableHighlight
                 onPress={this._pickImage}
                  underlayColor={'transparent'}
                 >
                 <Image resizeMode={'contain'}  source={require('../assets/images/pencil.png')} style={[customStyles.pencil, styles.iconColor]} />
               </TouchableHighlight>
             </View>
           </View>
         </View>
       </Image>
          </View>

          <View style={customStyles.menu}>
            <View style={{flex:1, borderBottomWidth:1, flexDirection:'row', justifyContent:'flex-end', alignItems:'flex-end'}}>
            <Text style={[customStyles.text]} > Email</Text>
              <Text style={[customStyles.text]} >{this.state.email} </Text>
          </View>
          <View style={{flex:1, borderBottomWidth:1, flexDirection:'row', justifyContent:'flex-end', alignItems:'flex-end'}}>
              <Text style={[customStyles.text]}>College</Text>
                <Text style={[customStyles.text]} > {this.state.college}</Text>
            </View>
            <View style={{flex:1, borderBottomWidth:1, flexDirection:'row', justifyContent:'flex-end', alignItems:'flex-end'}}>
              <Text style={[customStyles.text]} > Username</Text>
                <Text style={[customStyles.text]} >{this.state.username}</Text>
            </View>
        </View>
      </View>
    </View>
    );
  }
}
const customStyles = {
  text:{
    fontSize: 18,
    flex:1,
    fontFamily:(Platform.OS === 'ios') ? 'Didot' : 'sans-serif',
  },
  container:{
    flex:2,
    marginTop:5,

  },
  profile:{
    flex:3,
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'flex-start',
    borderRadius:5,
  },

  menu:{
    flex:4,
    backgroundColor:'white',
    justifyContent:'flex-start',
    alignItems:'flex-start',
  },

  profileContainer:{
    flex:1,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',

  },
  pencil:{
    flex:1,
    flexDirection:'row',
    resizeMode: 'contain',
    width: 30,
    height: 30,
    right:0,
    alignItems:'flex-end',
    justifyContent:'flex-end',

  },

  home:{
    margin: 15,
    resizeMode: 'contain',
    width: 30,
    height: 30,
    alignItems:'flex-end',
    flexDirection:'row',
    justifyContent:'flex-end',
    alignItems:'flex-end',
    flexDirection:'row',
  },
  profileText:{
    marginLeft: 15,

  },
  profilePicture:{
    width:100,
    height:100,
    borderColor:'white',
    borderRadius:50,
    borderWidth:3,
  },
}
