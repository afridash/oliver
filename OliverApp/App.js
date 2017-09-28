import React from 'react';
import { StyleSheet, AsyncStorage} from 'react-native';
import {Router, Scene} from 'react-native-router-flux'
import Index from './components/index'
import Login from './components/login'
import SignUp from './components/signup'
import Reset from './components/reset'
import Home from './components/home'
import * as main from './assets/styles/main.js'
import theme, { styles } from 'react-native-theme'
export default class App extends React.Component {
  async componentWillMount () {
    theme.setRoot(this)
    var activeTheme = await AsyncStorage.getItem('theme')
    if (activeTheme !== null) {
      if (activeTheme !== 'default') theme.active(activeTheme)
      else {
        theme.active()
      }
    }
  }
  render() {
    return (
      <Router navigationBarStyle>
        <Scene key='root' hideNavBar>
          <Scene key='index'  initial  component={Index} />
          <Scene key='login' component={Login}  />
          <Scene key='signup' component={SignUp} />
          <Scene key='resetpassword'  component={Reset} />
          <Scene key='home'  hideNavBar component={Home} />
        </Scene>
      </Router>
    );
  }
}
const customStyles = StyleSheet.create({
  navBarTitle:{
    color:'#FFFFFF'
  },
  barButtonTextStyle:{
      color:'#FFFFFF'
  },
  barButtonIconStyle:{
      tintColor:'rgb(255,255,255)'
  },
  backButtonTextStyle: {
    tintColor: 'white'
  },
})
