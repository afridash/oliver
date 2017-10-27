import React from 'react';
import { StyleSheet, Text, View , Image, TouchableHighlight, Alert, Platform, TextInput,ScrollView, AsyncStorage} from 'react-native';
import {Actions} from 'react-native-router-flux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Firebase from '../auth/firebase'
const firebase = require('firebase')
import * as validate from '../auth/validations'
import theme, { styles } from 'react-native-theme'
import Button from 'react-native-button'

import NavBar from './navBar'
export default class VerifyPin extends React.Component {
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
  verifyPin () {
    this.setState({isLoading: true})
    if (!this.state.pin === 'lincoln_FYE2017'){
      Alert.alert('Invalid Pin', 'Please Ask Your Instructor for Pin')
      this.setState({isLoading: false})
    } else {
      AsyncStorage.setItem('verified', 'true')
      return Actions.reset('drawer')
    }
  }
  render() {
    return (
      <ScrollView
      style={styles.container}
    >
        <NavBar backButton={true} />
        <View style={customStyles.title}><Text style={[customStyles.header, styles.header]}>Enter Pin</Text></View>
          <View style={{flex:1, height:50}}></View>
        <View style={customStyles.secondaryContainer}>
          <View style={customStyles.box}>
            <View style={customStyles.emailDIV}>
              <TextInput
                style={customStyles.input}
                autoCapitalize='none'
                autoCorrect={false}
                keyboardAppearance='dark'
                placeholder={'Pin'}
                placeholderTextColor={'black'}
                onChangeText={(pin) => this.setState({pin})}
                onSubmitEditing={() => { this.verifyPin() }}
                returnKeyType='next'
            />
            </View>
          </View>
            {!this.state.isLoading ? <Button onPress={()=>this.verifyPin()} style={[styles.primaryButton, customStyles.signupButton,customStyles.primaryButton]}>Continue</Button> : <Text style={[styles.primaryButton, customStyles.signupButton]}>Sending email...</Text>}
         </View>
         <View style={customStyles.title}></View>
         <View style={customStyles.title}></View>
       </ScrollView>
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
  input: {
    flex: 1,
    alignItems: 'stretch',
    textAlign: 'center',
    color: 'black',
    fontSize: 14,
    fontFamily:(Platform.OS === 'ios') ? 'verdana' : 'serif',
  },
  emailDIV: {
    flex: 3,
    flexDirection: 'row',
    height:90,
    borderColor: '#C8C8C8',
    borderBottomWidth: 0,
  },
  title: {
    flex:2,
    justifyContent:'center',
    alignItems:'center',
  },
  header:{
    fontSize:30,
    textDecorationLine:'underline',
    textDecorationColor:'white',
    fontFamily:(Platform.OS === 'ios') ? 'verdana' : 'serif',
    color:'#fafafa',
  },
  box: {
    flex:1,
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
