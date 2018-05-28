import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  Platform,
  RefreshControl,
  TouchableHighlight,
} from 'react-native'
import {Actions} from 'react-native-router-flux'
import theme, { styles } from 'react-native-theme'
import {Text, Icon, Button} from 'native-base'
import Firebase from '../auth/firebase'
const firebase = require('firebase')
import NavBar from './navBar'

export default class Leaderboard extends Component {
  constructor (props){
    super(props)
    this.state = {
      leaders:[],
      next:false,
      current:0,
      counter:0,
      loading:true,
      noActivity:false,
    }
    this.userStats = firebase.database().ref().child('user_stats')
    this.usersRef = firebase.database().ref().child('users')
    this.increment = 8
    this.data = []
    this.leaders = []
    firebase.auth().onAuthStateChanged(this.handleUser)
  }
  handleUser = (user) => {
    if (user) {
      this.setState({userId:user.uid})
    }
  }
  async componentWillMount () {
    this.retrieveLeaders()
  }
  async retrieveLeaders () {
    this.setState({loading:true, counter:0, current:0})
    await this.userStats.orderByChild('points').limitToLast(100).once('value', async (leaders)=> {
      var count = Object.keys(leaders.val()).length
      if (!leaders.exists()) this.setState({loading:false, noActivity:true})
      var index = 0
      leaders.forEach((leader)=> {
        this.usersRef.child(leader.key).once('value', (user)=> {
          this.leaders.unshift({
            points:leader.val().points,
            completed:leader.val().completed,
            displayName:user.val().displayName,
            username:user.val().username,
            college:user.val().college,
            profilePicture:user.val().profilePicture,
            key:leader.key,
          })
          this.leaders.length > this.increment ? this.setState({next:true}) : this.setState({next:false})
          index++
          if (index === count) {
            this.showNextSet()
          }
        })
      })
    })
  }
  loadMore () {
    if (this.state.isListScrolled) {
      this.showNextSet()
    }
  }
  renderItem = ({ item, index }) => {
     return (
      <TouchableHighlight
       style={customStyles.listItem} onPress={()=>Actions.user({userId:item.key})}>
        <View style={customStyles.secondaryContainer}>
          <Image source={{uri:item.profilePicture}} resizeMode={'cover'} style={customStyles.profilePicture} />
          <View style={customStyles.usernameContainer}>
            <Text style={[styles.textColor, customStyles.username]}>{item.displayName}</Text>
            <Text style={[styles.textColor, customStyles.details, {fontStyle:'italic'}]}>@{item.username}</Text>
            <Text style={[styles.textColor, customStyles.details]}>{item.college}</Text>
          </View>
          <View>
            <Text style={[styles.textColor, customStyles.details, {fontWeight:'500'}]}>{item.points} points</Text>
          </View>
        </View>
     </TouchableHighlight>
       )
    }
  async getNextSet () {
     for (var i=this.state.current; i<=this.state.counter; i++){
       this.data.push(this.leaders[i])
       this.setState({leaders:this.data, loading:false, noActivity:false})
     }
     await this.setState({counter:this.state.counter + 1})
   }
  async showNextSet () {
     if (this.state.counter + this.increment >= this.leaders.length-1){
       await this.setState({current:this.state.counter, counter:this.leaders.length-1, next:false,})
     }else {
         await this.setState({current:this.state.counter, counter:this.state.counter+this.increment})
     }
     await this.getNextSet()
   }
  renderFlatList () {
    return (
     <View style={{flex:1}}>
       <FlatList
         data={this.state.leaders}
         onScrollEndDrag={() => {this.setState({ isListScrolled: true }); }}
         extraData={this.state}
         ItemSeparatorComponent={()=><View style={customStyles.separator}></View>}
         renderItem={this.renderItem}
         onEndReachedThreshold={1}
         onEndReached={()=> this.loadMore()}
         refreshControl={
          <RefreshControl
          refreshing={this.state.loading}
             onRefresh={this.retrieveLeaders.bind(this)}
         />
        }
      />
     </View>
   )
  }
  render () {
    return (
      <View style={styles.container}>
        <View style={customStyles.container}>
          <NavBar title="Leaders" />
          <View style={{flex:10}}>
            {this.renderFlatList()}
          </View>
        </View>
       </View>
    )
  }
}
const customStyles = StyleSheet.create({
  container:{
    flex:10,
  },
  secondaryContainer: {
    flex:1,
    flexDirection:'row',
    padding:15,
    alignItems:'center'
  },
  listItem:{
    padding:5,
  },
  usernameContainer:{
    flex:1,
  },
  separator:{
    height:1,
    backgroundColor:'grey',
  },
  profilePicture:{
    width:60,
    height:60,
    borderRadius:30,
    borderColor:'white',
    borderWidth:1,
  },
  username:{
    marginLeft:10,
    fontSize:18,
    fontFamily:(Platform.OS === 'ios') ? 'verdana' : 'serif',
  },
  details:{
    marginLeft:10,
    fontSize:14,
    fontFamily:(Platform.OS === 'ios') ? 'verdana' : 'serif',
  },
});
