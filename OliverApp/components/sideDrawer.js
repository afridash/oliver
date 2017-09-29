import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, ViewPropTypes,  AsyncStorage } from 'react-native';
import Button from 'react-native-button';
import { Actions } from 'react-native-router-flux';
import theme, { styles } from 'react-native-theme'

class DrawerContent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
    this._defaultTheme = this._defaultTheme.bind(this)
    this._lightTheme = this._lightTheme.bind(this)
  }
  componentWillMount () {
    theme.setRoot(this)
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
  static propTypes = {
    name: PropTypes.string,
    sceneStyle: ViewPropTypes.style,
    title: PropTypes.string,
  }

  static contextTypes = {
    drawer: React.PropTypes.object,
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.secondaryContainer}>
          <Button onPress={Actions.closeDrawer}>Back</Button>
          <Button onPress={Actions.pop}>Back</Button>
          <Button onPress={Actions.add_course}>Add Course</Button>
          <Button onPress={Actions.start_exam}>Start Exam</Button>
          <Button onPress={Actions.login}>Login</Button>
          <Button onPress={Actions.home}>Home</Button>

          <Button onPress={this._lightTheme}>GO LIGHT</Button>
          <Button onPress={this._defaultTheme}>GO DARK</Button>
          <Button onPress={this._blueTheme}>GO BLUE</Button>
          <Button onPress={this._purpleTheme}>GO PURPLE</Button>
          <Button onPress={this._pinkTheme}>GO PINK</Button>
        </View>
      </View>
    );
  }
}

export default DrawerContent;
