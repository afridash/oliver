import React from 'react';
import { StyleSheet, Text, View , Image, TouchableHighlight, Platform} from 'react-native';
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
        <View style={styles.login}>
          <Text onPress={()=>Actions.login()} style={[styles.primaryButton,customStyles.loginButton]}>Log in</Text>
        </View>
        <View style={styles.secondaryContainer}>
          <View style={styles.title}><Text style={[styles.header,customStyles.headerInfo]}>Oliver</Text>
          <Text style={[styles.subtitle,customStyles.subtitleInfo]}>Exam Prep Simplified</Text>
        </View>
        <Slider informationStyle={customStyles.sliderInfo} style={[styles.image]} logoStyle={styles.logo} />
         </View>
         <TouchableHighlight style={styles.signup} onPress={()=>Actions.signup()}>
           <Text style={customStyles.signupButton}>Create Account</Text>
         </TouchableHighlight>
      </View>
    );
  }
}
const customStyles = StyleSheet.create({
  loginButton: {
    borderWidth:2,
    borderRadius:5,
  },
  signupButton: {
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    textAlign:'center',
    fontSize:25,
    padding:10,
    color:'white',
    fontFamily:(Platform.OS === 'ios') ? 'Didot' : 'serif',
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
})
