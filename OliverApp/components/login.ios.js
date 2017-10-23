import React from 'react';
import theme, { styles } from 'react-native-theme'
import {
  StyleSheet,
  Text,
  View ,
  Image,
  TouchableHighlight,
  Alert,
  Platform,
  TextInput,
  AsyncStorage
} from 'react-native';
import {Actions} from 'react-native-router-flux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Button from 'react-native-button'
import Firebase from '../auth/firebase'
const firebase = require('firebase')

import NavBar from './navBar'
export default class Login extends React.Component {
  constructor (props) {
    super (props)
    this.state = {
      email:'',
      password:'',
      isLoading: false,
    }
  }
  componentWillMount () {
    theme.setRoot(this)
  }
  async login () {
    this.setState({isLoading: true})
    var errors = false
    await firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).catch(function (error) {
      var errorMessage = error.message
      Alert.alert(errorMessage)
      errors = true
    })
    if (!errors) {
      var userId = await firebase.auth().currentUser.uid
      var user
      await firebase.database().ref().child('users').child(userId).once('value', (snapshot)=>{
        user = snapshot.val()
      })
      this.saveLocal(user)
      this.setState({isLoading: false})
      return Actions.reset('drawer')
    } else {
      this.setState({isLoading: false})
    }
  }
  async saveLocal(user){
    await AsyncStorage.multiSet([["email", user.email],
                                 ['name', user.firstName + ' ' + user.lastName],
                                  ['myKey', user.userKey],
                                  ['college', user.college],
                                  ['collegeId', user.collegeId],
                                  ['pPicture',user.profilePicture],
                                  ['username',user.username]])
  }
  render() {
    return (
      <KeyboardAwareScrollView
      style={{ backgroundColor: '#424242' }}
      resetScrollToCoords={{ x: 0, y: 0 }}
      contentContainerStyle={styles.container}
      scrollEnabled={false}
    >
      <NavBar backButton={true} title="Login" />
        <View style={customStyles.title}>
          <Image source={require('../assets/images/logo.png')} resizeMode={'cover'} style={[{width:150, height:150}, styles.iconColor]} />
        </View>
        <View style={customStyles.secondaryContainer}>
          <View style={customStyles.box}>
            <View style={customStyles.emailDIV}>
              <TextInput
                style={customStyles.input}
                keyboardType='email-address'
                autoCapitalize='none'
                autoCorrect={false}
                keyboardAppearance='dark'
                placeholder={'Email'}
                placeholderTextColor={'black'}
                onChangeText={(email) => this.setState({email})}
                onSubmitEditing={() => { this.passwordinput.focus() }}
                returnKeyType='next'
            />
            </View>
            <View style={customStyles.passwordDIV}>
              <TextInput
                style={customStyles.input}
                returnKeyType='go'
                ref={(input) => this.passwordinput = input}
                autoCorrect={false}
                autoCapitalize='none'
                keyboardAppearance='dark'
                placeholder={'Password '}
                placeholderTextColor={'black'}
                onSubmitEditing={() => { this.login() }}
                onChangeText={(password) => this.setState({password})}
                secureTextEntry
                    />
            </View>
          </View>
            {!this.state.isLoading ? <Button style={[styles.primaryButton, customStyles.loginButton,customStyles.primaryButton]} onPress={()=>this.login()}>Log in</Button> :
            <Text style={[styles.primaryButton, customStyles.loginButton, customStyles.primaryButton]}>Logging In...</Text>}
          <Text style={customStyles.information} onPress={()=>Actions.resetpassword()}>Forgot Password?</Text>
         </View>
         <View style={{flex:2}}></View>
       </KeyboardAwareScrollView>
    );
  }
}

const customStyles = StyleSheet.create({
  secondaryContainer: {
    flex:3.5,
    backgroundColor:'white',
    shadowColor:'#000000',
    shadowOffset:{width: 10, height: 10},
    shadowOpacity:0.5,
    shadowRadius:5,
    borderWidth:2,
    borderColor:'white',
    margin:40,
    borderRadius:10,
  },
  input: {
    flex: 1,
    alignItems: 'stretch',
    textAlign: 'center',
    color: 'black',
    fontSize: 14,
    fontFamily:'verdana' ,
  },
  emailDIV: {
    height:60,
    flexDirection: 'row',
    borderColor: '#C8C8C8',
    borderBottomWidth: 1,
  },
  passwordDIV: {
    height:60,
    flexDirection: 'row',
    borderColor: '#C8C8C8',
  },
  title: {
    flex:3,
    justifyContent:'flex-end',
    alignItems:'center',
  },
  header:{
    fontSize:30,
    fontFamily: 'verdana',
    color:'#fafafa',
  },
  box: {
    flex:2,
    flexDirection:'column',
    alignItems:'flex-start',
    justifyContent:'center',
  },
  information: {
    fontSize:20,
    fontFamily:'verdana',
    color:'#f5f5f5',
    padding:10,
    color:'black',
    textAlign:'center',
  },
  signup:{
    flex: 1 ,
    backgroundColor:'#0277bd',
  },
  loginButton: {
    borderWidth:2,
    borderRadius:10,
  },
  primaryButton: {
    fontSize:20,
    padding:10,
    textAlign:'center',
    color:'white',
    fontFamily: 'verdana',
    margin:5,
    borderColor:'#fafafa',
  },
});
