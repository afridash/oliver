import React, {Component} from 'react'
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  Platform,
  AsyncStorage,
} from 'react-native'
import {Actions} from 'react-native-router-flux'
import theme, { styles } from 'react-native-theme'
import Button from 'react-native-button'
import NavBar from './navBar'
export default class Themes extends Component {
  constructor (props) {
    super (props)
    this.state = {
      verified:false,
    }
    this._defaultTheme = this._defaultTheme.bind(this)
    this._lightTheme = this._lightTheme.bind(this)
    this._pinkTheme = this._pinkTheme.bind(this)
    this._blueTheme = this._blueTheme.bind(this)
    this._purpleTheme = this._purpleTheme.bind(this)
  }
  async componentWillMount () {
    theme.setRoot(this)
    var verified = await AsyncStorage.getItem('verified')
    if (verified !== null && verified !== '1') this.setState({verified: true})
  }
  async _defaultTheme () {
    if (theme.name !== 'default') {
      theme.active()
      await AsyncStorage.setItem('theme', 'default')
    }
    this.forceUpdate()
  }
  async _lightTheme () {
    if (theme.name !== 'light') {
      theme.active('light')
      await AsyncStorage.setItem('theme', 'light')
    }
    this.forceUpdate()
  }
  async _blueTheme () {
    if (theme.name !== 'blue') {
      theme.active('blue')
      await AsyncStorage.setItem('theme', 'blue')
    }
    this.forceUpdate()
  }
  async _purpleTheme () {
    if (theme.name !== 'purple') {
      theme.active('purple')
      await AsyncStorage.setItem('theme', 'purple')
    }
    this.forceUpdate()
  }
  async _pinkTheme () {
    if (theme.name !== 'pink') {
      theme.active('pink')
      await AsyncStorage.setItem('theme', 'pink')
    }
    this.forceUpdate()
  }
  render () {
    return (
      <View style={styles.container}>
        <NavBar backButton={true} title='Themes' />
        <StatusBar
          barStyle="light-content"
        />
        <View style={{flex:1}} >
            <View style={{flex:1}}></View>
          <View style={[customStyles.buttonContainer]}>
            <Button
              containerStyle={{
                padding:10,
                flex:1,
                height:45,
                overflow:'hidden',
                justifyContent:'center',
                alignItems:'center',
                borderRadius:10,
                flexDirection:'row',
                marginTop:10,
                backgroundColor: '#E0E0E0',
              }}
              style={customStyles.addButton}
              styleDisabled={{color: 'red'}}
              onPress={this._lightTheme}>
              Light Theme
            </Button>
            <Button
              containerStyle={{
                padding:10,
                flex:1,
                height:45,
                overflow:'hidden',
                justifyContent:'center',
                alignItems:'center',
                flexDirection:'row',
                borderRadius:10,
                marginTop:10,
                backgroundColor: '#424242',
              }}
              style={customStyles.addButton}
              styleDisabled={{color: 'red'}}
              onPress={this._defaultTheme}>
              Dark Theme
            </Button>
            <Button
              containerStyle={{
                padding:10,
                flex:1,
                height:45,
                flexDirection:'row',
                overflow:'hidden',
                justifyContent:'center',
                alignItems:'center',
                borderRadius:10,
                marginTop:10,
                backgroundColor: '#1A237E',
              }}
              style={customStyles.addButton}
              styleDisabled={{color: 'red'}}
              onPress={ this._blueTheme}>
              Blue Theme
            </Button>
            <Button
              containerStyle={{
                padding:10,
                flex:1,
                height:45,
                overflow:'hidden',
                flexDirection:'row',
                justifyContent:'center',
                alignItems:'center',
                borderRadius:10,
                marginTop:10,
                backgroundColor: '#880E4F',
              }}
              style={customStyles.addButton}
              styleDisabled={{color: 'red'}}
              onPress={this._pinkTheme}>
              Pink
            </Button>
            <Button
              containerStyle={{
                padding:10,
                flex:1,
                height:45,
                flexDirection:'row',
                overflow:'hidden',
                justifyContent:'center',
                alignItems:'center',
                borderRadius:10,
                marginTop:10,
                backgroundColor: '#4A148C',
              }}
              style={customStyles.addButton}
              styleDisabled={{color: 'red'}}
              onPress={this._purpleTheme}>
              Purple Theme
            </Button>
          </View>
          <View style={{flex:1}}></View>
        </View>
      </View>
    )
  }
}
const customStyles = StyleSheet.create({
  buttonContainer:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    marginTop:20,
    margin:10,
    padding:10,
  },
  addButton : {
    flex:1,
    fontSize: 20,
    color: 'white',
    fontFamily:(Platform.OS === 'ios') ? 'verdana' : 'serif',
  },
})
