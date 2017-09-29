import React, {Component} from 'react'
import {
  View,
  Text,
  AsyncStorage
} from 'react-native'
import {Actions} from 'react-native-router-flux'
import theme, { styles } from 'react-native-theme'
export default class Home extends Component {
  componentWillMount () {
    theme.setRoot(this)
  }
  async _defaultTheme () {
    if (theme.name !== 'default') {
      theme.active()
      await AsyncStorage.setItem('theme', 'default')
    }
  }
  async _lightTheme () {
    if (theme.name !== 'light') {
      theme.active('light')
      await AsyncStorage.setItem('theme', 'light')
    }
  }
  async _blueTheme () {
    if (theme.name !== 'blue') {
      theme.active('blue')
      await AsyncStorage.setItem('theme', 'blue')
    }
  }
  render () {
    return (
      <View style={styles.container}>
        <View style={styles.secondaryContainer} >
          <Text>Hello Esther! How are you?</Text>
          <Text onPress={this._lightTheme}>GO LIGHT</Text>
          <Text onPress={this._defaultTheme}>GO DARK</Text>
          <Text onPress={this._blueTheme}>GO BLUE</Text>
        </View>
      </View>
    )
  }
}
