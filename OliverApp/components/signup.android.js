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
      return Actions.universities({password:this.state.password,
        email:this.state.email,
        firstName:this.state.firstName,
        lastName:this.state.lastName,
        username:this.state.username
      })
    }else{
      Alert.alert('Passwords do not match, please try again')
      this.setState({isLoading:false})
    }
  }
  render() {
    return (
        <ScrollView style={styles.container} >
        <NavBar backButton={true} title="Sign Up" />
        <View style={customStyles.title}>
          <Image source={require('../assets/images/logo.png')} resizeMode={'cover'} style={[{width:150, height:150}, styles.iconColor]} />
        </View>
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
              <Button onPress={()=>this.createAccount()} style={[styles.primaryButton,customStyles.signupButton,customStyles.primaryButton]}>Create Account</Button>
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
    fontFamily: 'sans-serif',
  },
  emailDIV: {
    flexDirection: 'row',
    height:60,
    borderColor: '#C8C8C8',
    borderBottomWidth:  0 ,
  },
  passwordDIV: {
    flexDirection: 'row',
    height:60,
    borderColor: '#C8C8C8',
  },
  title: {
    justifyContent:'flex-end',
    alignItems:'center',
  },
  header:{
    marginTop:30,
    fontSize:40,
    textDecorationLine:'underline',
    textDecorationColor:'white',
    fontFamily: 'serif',
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
    fontFamily:'serif',
    margin:5,
    borderColor:'#fafafa',
  },
  scrollView: {
    backgroundColor:'red',
    height: 500
  },
});
