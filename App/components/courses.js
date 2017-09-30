import React, {Component} from 'react'
import {
  View,
  Text,
  AsyncStorage
} from 'react-native'
import {Actions} from 'react-native-router-flux'
import theme, { styles } from 'react-native-theme'

import NavBar from './navBar'
export default class Courses extends Component {
  componentWillMount () {
    theme.setRoot(this)
  }
  render () {
    return (
      <View style={styles.container}>
        <NavBar />
        <View style={styles.secondaryContainer} >
          <Text style={styles.header}>Courses</Text>
        </View>
      </View>
    )
  }
}
