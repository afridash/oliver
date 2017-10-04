import React from 'react';
import { StyleSheet, Text, View , Image, TouchableHighlight, Platform, StatusBar} from 'react-native';
import {Actions} from 'react-native-router-flux'
import Slider from './slider'
import theme, { styles } from 'react-native-theme'
export default class Index extends React.Component {
  componentWillMount () {
    theme.setRoot(this)
  }
  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          barStyle="light-content"
        />
        <View style={styles.login}>
          <Text onPress={()=>Actions.login()} style={[styles.primaryButton,customStyles.loginButton, customStyles.primaryButton]}>Log in</Text>
        </View>
        <View style={styles.secondaryContainer}>
          <View style={styles.title}><Text style={[styles.header, customStyles.headerInfo]}>Oliver</Text>
          <Text style={[styles.subtitle, customStyles.subtitleInfo]}>Exam Prep Simplified</Text>
        </View>
        <Slider style={styles.image} logoStyle={styles.logo} informationStyle={styles.information} />
         </View>
           <Text onPress={()=>Actions.signup()} style={[styles.primaryButton, customStyles.loginButton, customStyles.primaryButton]}>Create Account</Text>
      </View>
    );
  }
}
const customStyles = StyleSheet.create({
  loginButton: {
    borderWidth:1,
    borderRadius:5,
  },
  sliderInfo: {
    fontSize:20,
    padding:10,
    fontFamily:(Platform.OS === 'ios') ? 'Didot' : 'serif',
  },
  subtitleInfo: {
    fontSize:35,
    textShadowColor:'#01579b',
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius:2,
    fontFamily:(Platform.OS === 'ios') ? 'Didot' : 'serif',
  },
  headerInfo: {
    fontSize:100,
    fontFamily:(Platform.OS === 'ios') ? 'Didot' : 'serif',
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
})
