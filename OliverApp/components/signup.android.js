import React, {Component} from 'react';
import { StyleSheet, Text, View , Image, TouchableHighlight, Alert, Platform, TextInput, AsyncStorage, KeyboardAvoidingView, ScrollView} from 'react-native';
import {Actions} from 'react-native-router-flux'
import Button from 'react-native-button'
import theme, { styles } from 'react-native-theme'
import Firebase from '../auth/firebase'
const firebase = require('firebase')

import * as validate from '../auth/validations'
import NavBar from './navBar'
export default class SignUp extends Component {
  constructor (props) {
    super (props)
    this.state = {
      firstName:'',
      lastName:'',
      email:'',
      password:'',
      passwordConfirm:'',
      username:'',
      isLoading:false,
    }
    this.picture ='https://firebasestorage.googleapis.com/v0/b/oliver-f5285.appspot.com/o/users%2Fprofile%2Fuserprofile.png?alt=media&token=e96bc455-8477-46db-a3a2-05b4a1031fe8'
    this.usersRef = firebase.database().ref().child('users')
  }
  componentWillMount () {
    theme.setRoot(this)
  }
  async createAccount () {
    this.setState({isLoading:true})
    var p=false;
    if(validate.verifyLength(this.state.password,this.state.passwordConfirm) && validate.verifyMatch(this.state.password,this.state.passwordConfirm)){
      await firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).catch(function(error){
        Alert.alert(error.message)
        p=true
      });
      if(!p){
        var user = firebase.auth().currentUser
           user.updateProfile({
            displayName: this.state.firstName + " "+this.state.lastName,
            photoURL:this.picture
          }).then(function() {
            // Update successful.
          }, function(error) {
            console.log(error)
          })
          user.sendEmailVerification().then(function() {
              //Email sent
            }).catch(function(error) {
              // An error happened.
            })
       this.saveUserInfo(user.uid,this.state.email, this.state.firstName,this.state.lastName, this.state.username)
        this.saveLocalData(user.uid)
        return Actions.universities()
        this.setState({isLoading:false})
      }else{
        this.setState({isLoading:false})
      }
    }else{
      Alert.alert('Password Verification Error, please try again')
      this.setState({isLoading:false})
    }
  }
  saveUserInfo(userKey, email, firstName, lastName, username){
    this.usersRef.child(userKey).set({
      firstName: firstName,
      lastName:lastName,
      email: email,
      username : username,
      userKey:userKey,
      profilePicture:'https://firebasestorage.googleapis.com/v0/b/oliver-f5285.appspot.com/o/users%2Fprofile%2Fuserprofile.png?alt=media&token=e96bc455-8477-46db-a3a2-05b4a1031fe8'
      })
  }
  async saveLocalData(userID){
    await AsyncStorage.multiSet([["email", this.state.email],
                                 ['name', this.state.firstName+" "+this.state.lastName],
                                  ['myKey', userID],
                                  ['pPicture',this.picture],
                                  ['username',this.state.username],
                                ])
  }
  render() {
    return (
        <ScrollView style={styles.container} >
        <NavBar backButton={true} />
        <View style={customStyles.title}><Text style={[customStyles.header, styles.header]}>Sign Up</Text></View>
        <View style={customStyles.secondaryContainer}>
          <View style={customStyles.box}>
            <View style={customStyles.emailDIV}>
              <TextInput
                style={customStyles.input}
                keyboardType='default'
                autoCapitalize='sentences'
                autoCorrect
                keyboardAppearance='dark'
                placeholder={'First Name'}
                placeholderTextColor={'black'}
                onChangeText={(name) => this.setState({firstName:name})}
                onSubmitEditing={() => { this.lastNameInput.focus() }}
                returnKeyType='next'
            />
            </View>
            <View style={customStyles.emailDIV}>
              <TextInput
                style={customStyles.input}
                ref={(input) => this.lastNameInput = input}
                keyboardType='default'
                keyboardAppearance='dark'
                autoCapitalize='sentences'
                autoCorrect
                placeholder={'Last Name'}
                placeholderTextColor={'black'}
                onChangeText={(name) => this.setState({lastName:name})}
                onSubmitEditing={() => { this.emailInput.focus() }}
                returnKeyType='next'
            />
            </View>
            <View style={customStyles.emailDIV}>
              <TextInput
                style={customStyles.input}
                ref={(input) => this.emailInput = input}
                keyboardType='email-address'
                autoCapitalize='none'
                keyboardAppearance='dark'
                autoCorrect
                placeholder={'Email'}
                placeholderTextColor={'black'}
                onChangeText={(email) => this.setState({email})}
                onSubmitEditing={() => { this.passwordinput.focus() }}
                returnKeyType='next'
            />
            </View>
            <View style={customStyles.emailDIV}>
              <TextInput
                style={customStyles.input}
                ref={(input) => this.passwordinput = input}
                autoCorrect={false}
                autoCapitalize='sentences'
                placeholder={'Password '}
                keyboardAppearance='dark'
                placeholderTextColor={'black'}
                onSubmitEditing={() => { this.passwordinput2.focus() }}
                onChangeText={(password) => this.setState({password})}
                secureTextEntry
                returnKeyType='next'
                    />
            </View>
            <View style={customStyles.emailDIV}>
              <TextInput
                style={customStyles.input}
                ref={(input) => this.passwordinput2 = input}
                autoCorrect={false}
                autoCapitalize='sentences'
                keyboardAppearance='dark'
                placeholder={'Password Confirmation'}
                placeholderTextColor={'black'}
                onSubmitEditing={() => { this.usernameInput.focus() }}
                onChangeText={(password) => this.setState({passwordConfirm:password})}
                secureTextEntry
                returnKeyType='next'
                    />
            </View>
            <View style={customStyles.passwordDIV}>
              <TextInput
                returnKeyType='go'
                style={customStyles.input}
                ref={(input) => this.usernameInput = input}
                autoCorrect={false}
                autoCapitalize='sentences'
                keyboardAppearance='dark'
                placeholder={'Username'}
                placeholderTextColor={'black'}
                onSubmitEditing={() => {this.createAccount()}}
                onChangeText={(name) => this.setState({username:name})}

                    />
            </View>
          </View>
              {!this.state.isLoading ? <Button onPress={()=>this.createAccount()} style={[styles.primaryButton,customStyles.signupButton,customStyles.primaryButton]}>Create Account</Button> :
              <Text style={[styles.primaryButton,customStyles.signupButton,customStyles.primaryButton]}>Signing up...</Text>}
         </View>
         </ScrollView>
    );
  }
}

const customStyles = StyleSheet.create({
  secondaryContainer: {
    flex:5,
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
  input: {
    flex: 1,
    alignItems: 'stretch',
    textAlign: 'center',
    color: 'black',
    fontSize: 14,
    fontFamily:(Platform.OS === 'ios') ? 'verdana' : 'sans-serif',
  },
  emailDIV: {
    flex: 1,
    flexDirection: 'row',
    height:50,
    borderColor: '#C8C8C8',
    borderBottomWidth: (Platform.OS === 'android') ? 0 : 1,
  },
  passwordDIV: {
    flex: 1,
    flexDirection: 'row',
    height:50,
    borderColor: '#C8C8C8',
  },
  title: {
    flex:0.5,
    justifyContent:'center',
    alignItems:'center',
  },
  header:{
    marginTop:30,
    fontSize:40,
    textDecorationLine:'underline',
    textDecorationColor:'white',
    fontFamily:(Platform.OS === 'ios') ? 'verdana' : 'serif',
    color:'#fafafa',
  },
  box: {
    flex:8,
    flexDirection:'column',
    alignItems:'center',
    justifyContent:'center',
  },
  signup:{
    flex: 1 ,
    borderRadius:20,
    borderWidth:1,
    backgroundColor:'#0D47A1',
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
  scrollView: {
    backgroundColor:'red',
    height: 500
  },
});
