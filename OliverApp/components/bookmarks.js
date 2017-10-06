import React, {Component} from 'react'
import {
  View,
  Text,
  AsyncStorage,
  StyleSheet,
  Platform,
  FlatList,
  Image,
  RefreshControl,
} from 'react-native'
import Firebase from '../auth/firebase'
const firebase = require('firebase')
import {Actions} from 'react-native-router-flux'
import theme, { styles } from 'react-native-theme'
import Button from 'react-native-button'
import Swipeable from 'react-native-swipeable'
import NavBar from './navBar'

export default class Bookmarks extends Component {
  constructor (props) {
    super (props)
    this.state = {
      data: [],
      refreshing: false,
    }
    this.data = []
    this.renderItem = this.renderItem.bind(this)
    this.ref = firebase.database().ref().child('bookmarks')
    this.rightButtons = [<Text onPress={()=>this.handleSwipeClick()} style={customStyles.swipeButton}>Delete</Text>,]
  }
  async componentWillMount () {
    theme.setRoot(this)
    var key = await AsyncStorage.getItem('myKey')
    this.setState({userId:key})
    this.retrieveBookmarksOffline()
  }
  _onPressItem (index) {
    var clone = this.state.data
    clone[index].show = !clone[index].show
    this.setState({data:clone})
  }

  async retrieveBookmarksOffline () {
    //Retrieve and parse stored data in AsyncStorage
    //If no such data, read bookmarked questions from firebase, then store them locally
    var bookmarks = []
    var stored = await AsyncStorage.getItem("bookmarks")
    if (stored !== null && stored !== '1') bookmarks = JSON.parse(stored)
    if (bookmarks.length === 0 || bookmarks === null) {
      this.retrieveBookmarksOnline()
    }else{
      this.data = bookmarks
      this.setState({data:bookmarks})
    }
  }
  retrieveBookmarksOnline () {
    this.data = []
    this.setState({bookmarks:[], refreshing:true})
    this.ref.child(this.state.userId).once('value', (snapshots)=>{
      snapshots.forEach((childSnap)=>{
        if (childSnap.val().optionA === undefined) {
          this.data.push({key:childSnap.key, question:childSnap.val().question, answer:childSnap.val().answer})
          this.setState({data:this.data, refreshing:false})
          AsyncStorage.setItem('bookmarks', JSON.stringify(this.data))
        }else{
          var answer
          if (childSnap.val().answer === 'A') answer = childSnap.val().optionA
          else if (childSnap.val().answer === 'B') answer = childSnap.val().optionB
          else if (childSnap.val().answer === 'C') answer = childSnap.val().optionC
          else answer = childSnap.val().optionD
          this.data.push({key:childSnap.key, question:childSnap.val().question, answer:answer})
          this.setState({data:this.data, refreshing:false})
          AsyncStorage.setItem('bookmarks', JSON.stringify(this.data))
        }
      })
    })
  }

  handleSwipeClick () {
    //Delete row that has been clicked on after swiping
    var rem = this.state.data.splice(this.state.activeRow,1)
    this.setState({data:this.state.data})
    this.ref.child(this.state.userId).child(this.state.deleteRef).remove()
  }

  renderItem({ item, index }) {
   return (
     <View
      style={customStyles.listItem}
    >
      <Swipeable onRightActionRelease={()=>this.setState({activeRow:index, deleteRef:item.key})} rightActionActivationDistance={100} onRef={ref => this.swipeable = ref} rightButtons={this.rightButtons}>
      <View style={{flex:1, flexDirection:'row', justifyContent:'space-between'}}>
        <Text onPress={()=>this._onPressItem(index)} style={[customStyles.listText, styles.textColor]}>{index+1} {item.question}</Text>
        {!item.show ? <Image source={require('../assets/images/arrow_right.png')} style={[styles.iconColor, customStyles.icon]} resizeMode={'contain'}/> : <Image source={require('../assets/images/arrow_down.png')} style={[styles.iconColor, customStyles.icon]} resizeMode={'contain'}/>}
      </View>
      {item.show && <View style={{flex:1}}>
        <View style={customStyles.actionsContainer}>
        <Text style={[customStyles.actions, styles.textColor]}>{item.answer}</Text>
      </View>
      </View>
    }
    </Swipeable>
    </View>
      )
   }
  render () {
    return (
      <View style={styles.container}>
        <NavBar title='Bookmarks' />
        <View style={styles.secondaryContainer} >
          <View style={{flex:6, flexDirection:'row'}}>
            <FlatList
              data={this.state.data}
              ItemSeparatorComponent={()=><View style={customStyles.separator}></View>}
              renderItem={this.renderItem}
              refreshControl={
               <RefreshControl
               refreshing={this.state.refreshing}
                  onRefresh={this.retrieveBookmarksOnline.bind(this)}
              />
             }
         />
          </View>
        </View>
      </View>
    )
  }
}

const customStyles = StyleSheet.create({
  container:{
    flex:10,
    margin:5,
    justifyContent:'center',
    alignItems:'flex-start',
  },
  separator:{
    height:1,
    backgroundColor:'grey',
  },
  listItem:{
    padding:20,
  },
  listText:{
    fontSize:20,
    fontWeight:'500',
    fontFamily:(Platform.OS === 'ios') ? 'Didot' : 'serif',
    margin:5,
  },
  actionsContainer:{
    borderColor:'white',
    borderWidth:1,
    borderRadius:10,
    overflow:'hidden',
    margin:5,
    marginLeft:20,
    marginRight:20
  },
  actions:{
    padding:15,
    fontSize:18,
    fontFamily:(Platform.OS === 'ios') ? 'Didot' : 'serif',
    },
  icon:{
    marginTop:20,
    resizeMode: 'contain',
    width: 20,
    height: 20,
    alignItems:'flex-end',
  },
  swipeButton:{
    color:'white',
    fontSize:16,
    marginLeft:20,
    backgroundColor:'#ff1744',
    overflow:'hidden',
    padding:10,
    borderRadius:10,
    borderWidth:1,
    borderColor:'white',
    fontFamily:(Platform.OS === 'ios') ? 'Didot' : 'serif',
  },
})
