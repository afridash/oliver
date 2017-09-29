import {
 View, Image, StatusBar, TouchableWithoutFeedback
} from 'react-native';
import React, { Component } from 'react';
import { Actions, Router, Scene } from 'react-native-router-flux';
import theme, {styles} from 'react-native-theme'

export default class NavBar extends Component {
  componentWillMount () {
    theme.setRoot(this)
  }
  render() {
    return (
<View style={styles.navBar}>
      <StatusBar />
      <View style={{ flexDirection: 'row' }}>
      <TouchableWithoutFeedback onPress={Actions.drawerOpen}>
      <Image
    source={require('../assets/images/menu_burger.png')}
    style={customStyles.backarrowStyle} />
      </TouchableWithoutFeedback>

      <Image
      source={require('../assets/images/menu_burger.png')}
      style={customStyles.helpStyle} />

      <Image
    source={require('../assets/images/menu_burger.png')}
    style={customStyles.settingStyle} />
    </View>
</View>
    );
  }
}
const customStyles = {
  backarrowStyle: {
    resizeMode: 'contain',
    flexDirection: 'row',
    width: 50,
    height: 50,
    left: 0,
    justifyContent: 'flex-start'
  },
  helpStyle: {
    resizeMode: 'contain',
      width: 50,
      height: 50,
      left: 220,
      justifyContent: 'flex-end',
      position: 'relative'

  },
  settingStyle: {
    resizeMode: 'contain',
    width: 50,
    height: 50,
    justifyContent: 'flex-end',
  position: 'relative',
  left: 210
  }
};
