import React, {Component} from 'react'
import {
  View,
  Text,
  AsyncStorage
} from 'react-native'
import {Actions} from 'react-native-router-flux'
import theme, { styles } from 'react-native-theme'
export default class Exams extends Component {
  componentWillMount () {
    theme.setRoot(this)
  }
  render () {
    return (
      <View style={styles.container}>
        <View style={styles.secondaryContainer} >
          <Text style={styles.header}>Start</Text>
        </View>
      </View>
    )
  }
}
