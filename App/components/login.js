import React from 'react';
import theme, { styles } from 'react-native-theme'
import { StyleSheet, Text, View , Image, TouchableHighlight, Alert, Platform, TextInput,} from 'react-native';
import {Actions} from 'react-native-router-flux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default class Login extends React.Component {
  constructor (props) {
    super (props)
    this.state = {}
  }
  componentWillMount () {
    theme.setRoot(this)

  }
  componentDidMount () {

  }
  componentWillReceiveProps () {
    Actions.refresh({hideNavBar:true})
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
        <View style={customStyles.title}><Text style={[customStyles.header, styles.header]}>Log In</Text></View>
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
                onSubmitEditing={() => { this.goHome() }}
                onChangeText={(password) => this.setState({password})}
                secureTextEntry
                    />
            </View>
          </View>
            <Text style={[styles.primaryButton, customStyles.loginButton, customStyles.primaryButton]} onPress={()=>Actions.drawer({type:'replace'})}>Log in</Text>
          <Text style={customStyles.information} onPress={()=>Actions.resetpassword()}>Forgot Password?</Text>
         </View>
         <View style={customStyles.title}></View>
         <View style={customStyles.title}></View>
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
    flex: (Platform.OS === 'android') ? 3 : 2,
    flexDirection: 'row',
    height:50,
    borderColor: '#C8C8C8',
    borderBottomWidth: (Platform.OS === 'android') ? 0 : 1,
  },
  passwordDIV: {
    flex: (Platform.OS === 'android') ? 3 : 2,
    flexDirection: 'row',
    height:50,
    borderColor: '#C8C8C8',
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
    flex:3,
    flexDirection:'column',
    alignItems:'center',
    justifyContent:'center',
  },
  information: {
    fontSize:20,
    fontFamily:(Platform.OS === 'ios') ? 'Didot' : 'sans-serif',
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
    fontFamily:(Platform.OS === 'ios') ? 'Didot' : 'serif',
    margin:5,
    borderColor:'#fafafa',
  },
});
