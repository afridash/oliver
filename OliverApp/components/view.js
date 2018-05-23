import {
 View,
 Image,
 TouchableWithoutFeedback,
 Text,
 Dimensions,
 Platform,
 AsyncStorage,
} from 'react-native';
import React, { Component } from 'react';
import { Actions} from 'react-native-router-flux';
import theme, {styles} from 'react-native-theme'
import NavBar from './navBar'
export default class ViewFull extends Component {
  constructor (props) {
    super(props)
    this.state = {
      profilePicture:'none',
    }
  }
  componentWillMount () {
    theme.setRoot(this)
    this.getPicture()
  }
  async getPicture () {
    var pic = await AsyncStorage.getItem('pPicture')
    var name = await AsyncStorage.getItem('username')
    this.setState({profilePicture:pic, name: name})
  }
  render() {
    return (
      <View style={styles.container}>
        <NavBar backButton={true} title={this.state.name} />
      <View style={{flex:1, justifyContent:'center', alignItems:'center' }}>
        <Image source={{uri: this.state.profilePicture}} resizeMode={'contain'} style={customStyles.profile} />
      </View>
    </View>
    );
  }
}
const customStyles = {
  profile: {
    flexDirection: 'row',
    width: Dimensions.get('window').width,
    height: 300,
    alignItems:'center',
    justifyContent: 'center'
  },
}
