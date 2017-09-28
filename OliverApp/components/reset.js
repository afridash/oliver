import React from 'react';
import { StyleSheet, Text, View , Image, TouchableHighlight, Alert, Platform, TextInput,} from 'react-native';
import {Actions} from 'react-native-router-flux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import theme, { styles } from 'react-native-theme'
export default class Reset extends React.Component {
  constructor (props) {
    super (props)
    this.state = {}
  }
  componentWillMount () {
    theme.setRoot(this)
  }
  _handlePress = () => {
    Alert.alert('Clicked')
  }
  render() {
    return (
      <KeyboardAwareScrollView
      style={{ backgroundColor: '#424242' }}
      resetScrollToCoords={{ x: 0, y: 0 }}
      contentContainerStyle={styles.container}
      scrollEnabled={false}
    >
        <View style={customStyles.title}><Text style={customStyles.header}>Reset Password</Text></View>
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
          </View>
            <Text style={[styles.primaryButton, customStyles.signupButton]}>Reset</Text>
         </View>
         <View style={customStyles.title}></View>
         <View style={customStyles.title}></View>
       </KeyboardAwareScrollView>
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
    fontFamily:(Platform.OS === 'ios') ? 'Didot' : 'sans-serif',
  },
  emailDIV: {
    flex: (Platform.OS === 'android') ? 3 : 2,
    flexDirection: 'row',
    height:50,
    borderColor: '#C8C8C8',
    borderBottomWidth: (Platform.OS === 'android') ? 0 : 1,
  },
  title: {
    flex:2,
    justifyContent:'center',
    alignItems:'center',
  },
  header:{
    fontSize:40,
    textDecorationLine:'underline',
    textDecorationColor:'white',
    fontFamily:(Platform.OS === 'ios') ? 'Didot' : 'serif',
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
});
