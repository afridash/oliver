import React, {Component} from 'react'
import {
  View,
  Text,
  StatusBar,
} from 'react-native'
import {Actions} from 'react-native-router-flux'
import theme, { styles } from 'react-native-theme'
export default class Home extends Component {
  constructor (props) {
    super (props)
    this.state = {}
  }
  componentWillMount () {
    theme.setRoot(this)
  }
  render () {
    return (
      <View style={styles.container}>
        <StatusBar
          barStyle="light-content"
        />
        <View style={styles.secondaryContainer} >
          <Text style={styles.header}>Home</Text>
          <Text onPress={Actions.drawerOpen} style={styles.subtitle}>Open Drawer</Text>

        </View>
      </View>
    )
  }
}
