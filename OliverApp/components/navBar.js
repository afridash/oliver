import {
 View, Image, StatusBar, TouchableWithoutFeedback
} from 'react-native';
import React, { Component } from 'react';
import { Actions, Router, Scene } from 'react-native-router-flux';

export default class NavBar extends Component {
  render() {
    return (
<View style={styles.backgroundStyle}>
      <StatusBar />
      <View style={{ flexDirection: 'row' }}>
      <TouchableWithoutFeedback onPress={Actions.drawerOpen}>
      <Image
    source={require('../assets/images/menu_burger.png')}
    style={styles.backarrowStyle} />
      </TouchableWithoutFeedback>

      <Image
      source={require('../assets/images/menu_burger.png')}
      style={styles.helpStyle} />

      <Image
    source={require('../assets/images/menu_burger.png')}
    style={styles.settingStyle} />
    </View>
</View>
    );
  }
}
const styles = {
  backgroundStyle: {
    borderTopWidth:20,
    borderColor:'#757575',
    backgroundColor: '#616161'
  },
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
