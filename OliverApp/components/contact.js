import React,{Component} from 'react'
import Firebase from '../auth/firebase'
import { WebView, View } from 'react-native';
import NavBar from './navBar'
import theme, { styles } from 'react-native-theme'
const firebase = require('firebase')
export default class Contact extends Component {
  render() {
    return (
      <View style={styles.container}>
        <NavBar backButton={true} />
        <WebView
          source={{uri: 'https://oliver.afridash.com'}}
          style={{marginTop: 20}}
        />
      </View>
    );
  }
}
