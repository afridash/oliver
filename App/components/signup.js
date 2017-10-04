import React, {Component} from 'react';
import { StyleSheet, Text, View , Image, TouchableHighlight, Alert, Platform, TextInput} from 'react-native';
import {Actions} from 'react-native-router-flux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import theme, { styles } from 'react-native-theme'
export default class SignUp extends Component {
  constructor (props) {
    super (props)
    this.state = {}
  }
  componentWillMount () {
    theme.setRoot(this)
  }
  createAccount = () => {
    Alert.alert('Clicked')
  }
  render() {
    return (
        <KeyboardAwareScrollView
        style={{ backgroundColor: '#424242' }}
        resetScrollToCoords={{ x: 0, y: 0 }}
        contentContainerStyle={styles.container}
        scrollEnabled
      >
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
              <Text onPress={()=>Actions.home({type:'replace'})} style={[styles.primaryButton,customStyles.signupButton, customStyles.primaryButton]}>Create Account</Text>
         </View>
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
    fontFamily:(Platform.OS === 'ios') ? 'Didot' : 'sans-serif',
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
    fontFamily:(Platform.OS === 'ios') ? 'Didot' : 'serif',
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
    fontFamily:(Platform.OS === 'ios') ? 'Didot' : 'serif',
    margin:5,
    borderColor:'#fafafa',
  },
});
