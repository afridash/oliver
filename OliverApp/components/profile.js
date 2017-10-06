import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, ViewPropTypes, Platform, Image, AsyncStorage,TouchableHighlight } from 'react-native';
import Button from 'react-native-button';
import { Actions } from 'react-native-router-flux'
import theme, { styles } from 'react-native-theme'
var ImagePicker = require('react-native-image-picker')
import Firebase from '../auth/firebase'
const firebase = require('firebase')
import NavBar from './navBar'
import RNFetchBlob from 'react-native-fetch-blob'
const Blob = RNFetchBlob.polyfill.Blob
const fs = RNFetchBlob.fs
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
window.Blob = Blob
const uploadImage = (uri, ref, mime = 'application/octet-stream') => {
  return new Promise((resolve, reject) => {
    const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri
    let uploadBlob = null
    const imageRef = ref
    fs.readFile(uploadUri, 'base64')
      .then((data) => {
        return Blob.build(data, { type: `${mime};BASE64` })
      })
      .then((blob) => {
        uploadBlob = blob
        return imageRef.put(blob, { contentType: mime })
      })
      .then(() => {
        uploadBlob.close()
        return imageRef.getDownloadURL()
      })
      .then((url) => {
        resolve(url)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
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
    var user = firebase.auth().currentUser
    var ref = firebase.storage().ref().child('users').child('profilePictures').child(user.uid)
    var options = {
      title: 'Select Profile Picture',
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
    };
    ImagePicker.launchImageLibrary(options, (response)  => {
      console.log('Response = ', response);

        if (response.didCancel) {
          console.log('User cancelled image picker')
        }
        else if (response.error) {
          console.log('ImagePicker Error: ', response.error)
        }
        else {
          let source = { uri: response.uri }
          //let source = { uri: 'data:image/jpeg;base64,' + response.data }
          this.setState({
            profilePicture: source.uri
          })
          AsyncStorage.setItem('pPicture', source.uri)
          this.saveImage(source.uri)
        }
    })
  }
  async saveImage (uri) {
    var picture
    var user = firebase.auth().currentUser
    var ref = firebase.storage().ref().child('users').child('profile').child(user.uid)
    await uploadImage(uri, ref, 'image/jpeg').then(url => {
      picture = url
    })
      .catch(error => console.log(error))
    if (picture !== '') {
      user.updateProfile({
        photoURL: picture,
      })
      firebase.database().ref('users/' + user.uid).update({
        profilePicture: picture,
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
