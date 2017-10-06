import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet,
  Text,
  View,
  ViewPropTypes,
  Platform,
  Image,
  AsyncStorage,
  TouchableHighlight,
  Dimensions,
  CameraRoll,
  ScrollView,
  ActivityIndicator,
 } from 'react-native';
import Button from 'react-native-button';
import { Actions } from 'react-native-router-flux';
import theme, { styles } from 'react-native-theme'
import Display from 'react-native-display'
import Firebase from '../auth/firebase'
const firebase = require('firebase')
import account from '../assets/styles/activities'
//import * as upload from '../jsHelpers/upload'
import customStyles from '../assets/styles/photos'
import NavBar from './navBar'

export default class ProfilePicture extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      scrollEnabled: true,
      enable: false,
      images: [],
      isCameraLoaded: true,
      lastCursor: null,
      noMorePhotos: false,
      loadingMore: false,
      path: 'none',
      profile: 'none',
      isLoading: false,
      base64: '',
      caller: ''

    }
  }
  width () {
    return {
      width: Dimensions.get('window').width - 10
    }
  }

  async _savePicture () {
      this.setState({isLoading: true})
      AsyncStorage.setItem('pPicture', this.state.profile)
      var uri = this.state.profile
      //this.saveImage(uri)
      this.setState({isLoading: false})
      return Actions.pop({refresh:{done:true}})
  }
   async saveImage (uri) {
    var picture
    var user = firebase.auth().currentUser
    var ref = firebase.storage().ref().child('users').child('profilePictures').child(user.uid)
    ref.put(uri).then(this.savePictureOnline.bind(this))
  }
  savePictureOnline (snapshot) {
    var user = firebase.auth().currentUser
    if (user) {
      user.updateProfile({
        photoURL: snapshot.downloadURL,
      }).then(function(){
        console.log('Uploaded')
      })
      firebase.database().ref().child('users').child(user.uid).update({
        profilePicture: snapshot.downloadURL,
      })
    }
  }
  hideTemp () {
    this.setState({scrollEnabled: true})
    this.setState({enable: false})
  }
  async componentWillMount () {
    theme.setRoot(this)
    this.endReached()

  }

  tryPhotoLoad () {
    if (!this.state.loadingMore) {
      this.setState({ loadingMore: true }, () => { this.loadPhotos() })
    }
  }
  loadPhotos () {
    const fetchParams = {
      first: 30,
      groupTypes: 'SavedPhotos'
    }

    if (Platform.OS === 'android') {
  // not supported in android
      delete fetchParams.groupTypes
    }

    if (this.state.lastCursor) {
      fetchParams.after = this.state.lastCursor
    }

    CameraRoll.getPhotos(fetchParams).then((data) => {
      this.appendAssets(data)
    }).catch((e) => {
      console.log(e)
    })
  }

  appendAssets (data) {
    const assets = data.edges
    const images = assets.map((asset) => asset.node.image)
    const nextState = {
      loadingMore: false
    }

    if (!data.page_info.has_next_page) {
      nextState.noMorePhotos = true
    }

    if (assets.length > 0) {
      nextState.lastCursor = data.page_info.end_cursor
      nextState.images = this.state.images.concat(images)
      nextState.isCameraLoaded = this.state.isCameraLoaded
      nextState.enable = this.state.enable
      nextState.scrollEnabled = this.state.scrollEnabled
      nextState.path = this.state.path
      nextState.profile = this.state.profile
    }
    this.setState(nextState)
    this.setState({isCameraLoaded: true})
  }

  endReached () {
    if (!this.state.noMorePhotos) {
      this.tryPhotoLoad()
    }
  }
  _viewImage (uri) {
      this.setState({path: uri,profile: uri,scrollEnabled: false,enable: true})
  }


  render () {
    if (!this.state.isCameraLoaded) {
      return (
               <Text>Allow Access To Camera Through Settings</Text>
             )
    }
    return (
      <View style={styles.container}>
        <View style={account.header}>
          <TouchableHighlight style={account.headerContent}
            underlayColor='#EEEEEE'
            onPress={Actions.pop} >
            <View style={account.headerContent}>
              <Text style={[styles.textColor, {marginTop:20, fontSize:18}]}>Cancel</Text>
            </View>
          </TouchableHighlight>
        </View>
        <ScrollView style={customStyles.container}
          onScroll={this.endReached.bind(this)}
          scrollEnabled={this.state.scrollEnabled}
          scrollEventThrottle={32}
          >
          <View style={customStyles.imageGrid}>
            { this.state.images.map((image, key) => <TouchableHighlight key={key}
              style={{width: 120, height: 100}} onPress={this._viewImage.bind(this, image.uri)}>
              <Image style={customStyles.image} source={{ uri: image.uri }} />
          </TouchableHighlight>)}
          </View>
        </ScrollView>
        <Display enable={this.state.enable}
          enter='fadeInDown'
          exit='fadeOutUp'
          enterDuration={500}
          exitDuration={500}
          style={[customStyles.display]}>
          <Image
            style={{
              flex: 1,
              width: Dimensions.get('window').width,
              height: Dimensions.get('window').height,
              borderRadius: 20,
              marginLeft: 0,
              marginRight: 0}}
            resizeMode={'cover'}
            source={{uri: this.state.path}}
          />
          {this.state.isLoading ? <Display enable={this.state.enable}
            enter='fadeInDown'
            exit='fadeOutUp'
            enterDuration={500}
            exitDuration={500}
            style={customStyles.indicator}>
            <ActivityIndicator
              animating
              size='large'
              />
          </Display> : <Display enable={this.state.enable}
            enter='fadeInDown'
            exit='fadeOutUp'
            enterDuration={500}
            exitDuration={500}
            style={customStyles.menu}>
            <View style={customStyles.camera}>
              <Text style={customStyles.Choices} onPress={this.hideTemp.bind(this)}>Change</Text>
              <Text style={customStyles.Choices} onPress={this._savePicture.bind(this)}>Use</Text>
            </View>
          </Display> }
        </Display>
      </View>
    )
  }
}
