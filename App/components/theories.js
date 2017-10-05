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
import {Actions} from 'react-native-router-flux'
import theme, { styles } from 'react-native-theme'
import Firebase from '../auth/firebase'
const firebase = require('firebase')

import NavBar from './navBar'
export default class Theories extends Component {
  constructor (props) {
    super (props)
    this.state = {
      questions:[],
      index:0,
      isLoading:true,
      noQuestions:false,
      refreshing:false,
      total:0,
    }
    this.renderItem = this.renderItem.bind(this)
    this.ref = firebase.database().ref().child('questions').child(this.props.courseId)
  }

  componentWillMount () {
    //Set theme styles
    theme.setRoot(this)
    //Start component lifecycle with call to loading questions stored offline
    this.retrieveQuestionsOffline()
  }
  async retrieveQuestionsOffline () {
    //Retrieved and parse stored data in AsyncStorage
    //If no such data, read questions from firebase, then store them locally
    var questions = []
    var stored = await AsyncStorage.getItem(this.props.courseId)
    if (stored !== null) questions = JSON.parse(stored)
    if (questions.length === 0 || questions === null) {
      this.retrieveQuestionsOnline ()
    }else{
      this.data = questions
      this.setState({questions:questions, noQuestions:false,isLoading:false, total:questions.length})
    }
  }
  retrieveQuestionsOnline () {
    this.data = []
    this.setState({refreshing:true,isLoading:false,noQuestions:false})
    this.ref.orderByChild('type').equalTo('theory').once('value',(snapshot)=>{
      if (snapshot.val()  !== null ) this.setState({refreshing:false, noQuestions:false,isLoading:false})
      else this.setState({refreshing:false, noQuestions:true,isLoading:false})
      snapshot.forEach((snap)=>{
        if (snap.val().answered) {
          this.data.push({key:snap.key, question:snap.val().question, answer:snap.val().answer, show:false,})
          this.setState({questions:this.data, total:this.state.total+1})
          AsyncStorage.setItem(this.props.courseId, JSON.stringify(this.data))
        }else {
          this.data.push({key:snap.key, question:snap.val().question, answer:':( Sorry, No Answer Yet...But We Are Working On It! ', show:false,})
          this.setState({questions:this.data, total:this.state.total+1})
          AsyncStorage.setItem(this.props.courseId, JSON.stringify(this.data))
        }
      })
    })

  }
  _onPressItem (index) {
    //Indicate what question has been marked to show/hide the answer
    var clone = this.state.questions
    clone[index].show = !clone[index].show
    this.setState({questions:clone})
  }
  renderItem({ item, index }) {
   return (
     <View
      style={customStyles.listItem}
    >
      <View style={{flex:1, flexDirection:'row', justifyContent:'space-between'}}>
        <Text onPress={()=>this._onPressItem(index)} style={[customStyles.listText, styles.textColor]}>{index+1}.  {item.question}</Text>
        {!item.show ? <Image source={require('../assets/images/arrow_right.png')} style={[styles.iconColor, customStyles.icon]} resizeMode={'contain'}/> : <Image source={require('../assets/images/arrow_down.png')} style={[styles.iconColor, customStyles.icon]} resizeMode={'contain'}/>}
      </View>
      {item.show && <View style={{flex:1}}>
        <View style={customStyles.actionsContainer}>
        <Text style={[customStyles.actions, styles.textColor]}>Answer: {item.answer}</Text>
      </View>
      </View>
    }
    </View>
      )
   }
   renderFlatList () {
     return (
       <FlatList
         data={this.state.questions}
         ItemSeparatorComponent={()=><View style={customStyles.separator}></View>}
         renderItem={this.renderItem}
         refreshControl={
          <RefreshControl
          refreshing={this.state.refreshing}
             onRefresh={this.retrieveQuestionsOnline.bind(this)}
         />
        }
    />
     )
   }
   render () {
    return (
      <View style={styles.container}>
        <NavBar progress={''+this.state.total} title={this.props.courseCode} backButton={true}/>
        <View style={styles.secondaryContainer} >
          <View style={{flex:6, flexDirection:'row'}}>
            {(()=>{
              if (this.state.isLoading) return (
                <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                  <Text style={[customStyles.listText, styles.textColor]}>Loading...</Text></View>
              )
              else if (this.state.noQuestions) return (<View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                <Text style={[customStyles.listText, styles.textColor]}>:( No Theories...Check Back Later</Text></View>)
              else return this.renderFlatList()
            })()
          }
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
})
