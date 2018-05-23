import React, {Component} from 'react';
import { StyleSheet, Text, View , Image, TouchableHighlight, Alert, Platform, TextInput, AsyncStorage, ScrollView} from 'react-native';
import {Actions} from 'react-native-router-flux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
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
  }
  componentWillMount () {
    theme.setRoot(this)
  }
  async createAccount () {
    if(validate.verifyLength(this.state.password,this.state.passwordConfirm) && validate.verifyMatch(this.state.password,this.state.passwordConfirm)){
      return Actions.universities({
        password:this.state.password,
        email:this.state.email,
        firstName:this.state.firstName,
        lastName:this.state.lastName,
        username:this.state.username,
        displayName:this.state.firstName + ' ' + this.state.lastName
      })
    }else{
      Alert.alert('Passwords do not match, please try again')
    }
  }
  render() {
    return (
        <KeyboardAwareScrollView
        style={{ backgroundColor: '#424242' }}
        resetScrollToCoords={{ x: 0, y: 0 }}
        contentContainerStyle={styles.container}
        scrollEnabled
      >
        <NavBar backButton={true} title="Sign Up" />
        <View style={customStyles.title}>
          <Image source={require('../assets/images/logo.png')} resizeMode={'cover'} style={[{width:150, height:150}, styles.iconColor]} />
        </View>
        <ScrollView
         style={customStyles.secondaryContainer}>
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
         </ScrollView>
    </KeyboardAwareScrollView>
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
    flexDirection: 'row',
    height:50,
    borderColor: '#C8C8C8',
    borderBottomWidth: (Platform.OS === 'android') ? 0 : 1,
  },
  passwordDIV: {
    flexDirection: 'row',
    height:50,
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
});
