import React, {Component} from 'react'
import {
  View,
  Text,
  Platform,
  FlatList,
  StyleSheet,
  TextInput,
  Image,
  Alert,
  AsyncStorage,
  RefreshControl,
  TouchableHighlight,
} from 'react-native'
import {Actions} from 'react-native-router-flux'
import theme, { styles } from 'react-native-theme'
import Firebase from '../auth/firebase'
import NavBar from './navBar'
const firebase = require('firebase')

export default class Courses extends Component {
  constructor (props) {
    super (props)
    this.state = {
      name:'',
      code:'',
      data:[],
      refreshing: false,
      department:[],
    }
    this.data = []
    this.renderItem = this.renderItem.bind(this)
  }
  async componentWillMount () {
    theme.setRoot(this)
    var collegeId = await AsyncStorage.getItem('collegeId')
    var key = await AsyncStorage.getItem('myKey')
    var currentUser = await AsyncStorage.getItem('currentUser')
    this.setState({userId:key, collegeId:collegeId})
    if (currentUser === key)
    this.retrieveCoursesOffline()
    else this.retrieveCoursesOnline()
  }

  async retrieveCoursesOffline () {
    // Retrieves the courses when there's no internet
    var courses = []
    var stored = await AsyncStorage.getItem("courses")
    if (stored !== null) courses = JSON.parse(stored)
    if (courses.length === 0 || courses === null) {
      this.retrieveCoursesOnline()
    }else{
      this.data = courses
      this.setState({data:courses})
      this.filterByDepartment()
    }
  }
  async retrieveCoursesOnline () {
    //1.Retrieve users courses from faculties in firebase and store them locally using AsyncStorage
    //Also filters the courses by department using the department Key
    this.data = []
    this.setState({courses:[], refreshing:true})
     firebase.database().ref().child('faculties').child(this.state.collegeId).once('value', (snapshots)=>{
      snapshots.forEach((childSnap)=>{
        firebase.database().ref().child('departments').child(childSnap.key).once('value', (snapshot)=>{
          snapshot.forEach((department)=>{
            firebase.database().ref().child('courses').child(department.key).once('value', (snap)=>{
              snap.forEach((course)=>{
                this.data.push({key:course.key, show:false, name:course.val().name, code:course.val().code, department:department.key})
                this.setState({data:this.data, refreshing:false})
                this.filterByDepartment()
                AsyncStorage.setItem('courses', JSON.stringify(this.data))
              })
            })
          })
        })
      })
    })
  }
  //Filters the department by the courses specific to that department
  filterByDepartment (){
      if (this.props.departmentKey){
        this.remainder = this.state.data.filter((course)=> {
          return course.department === this.props.departmentKey
        })
        if (this.remainder.length > 0)
        this.setState({data:this.remainder, noSearchResult:false})
        else this.setState({noSearchResult:true})
      }
  }
  //Add Course to firebase db only using their course name and code.
  writeAddCourses(item) {
  firebase.database().ref().child('user_courses').child(this.state.userId).child(item.key).set({
    name:item.name,
    code:item.code,
  });
  //Alerts the user when their entry has been inputted in firebase
  Alert.alert(item.name, 'has been added to your list')
}
//Filters the search by the name
  searchcourses (text) {
    var clone = this.data
    this.result = clone.filter ((course) => { return course.name.toLowerCase().includes(text.toLowerCase()) === true || course.code.toLowerCase().includes(text.toLowerCase()) === true})
    if (this.result.length > 0)
    this.setState({data:this.result, noSearchResult:false})
    else this.setState({noSearchResult:true})
  }
  renderHeader () {
    return  (
      <View style={customStyles.inputContainer} >
        <TextInput
          style={customStyles.input}
          placeholder='Filter by course title or course code'
          onChangeText={(text) => { this.searchcourses(text) }}
        />
      </View>
    )
  }
  //Function for whenever an item is pressed
  _onPressItem (index) {
    var clone = this.state.data
    clone[index].show = !clone[index].show
    this.setState({data:clone})
  }

  renderItem({ item, index }) {
   return (
     <View
      style={customStyles.listItem}
    ><TouchableHighlight onPress={()=>this._onPressItem(index)} style={{flex:1}}>
      <View style={{flex:1, flexDirection:'row', justifyContent:'space-between'}}>
          <Text style={[customStyles.listText, styles.textColor]}> {item.name} ({item.code})</Text>
          {!item.show ? <Image source={require('../assets/images/arrow_right.png')} style={[styles.iconColor, customStyles.icon]} resizeMode={'contain'}/> : <Image source={require('../assets/images/arrow_down.png')} style={[styles.iconColor, customStyles.icon]} resizeMode={'contain'}/>}
      </View>
        </TouchableHighlight>
      {item.show && <View style={{flex:1}}>
        <View style={customStyles.actionsContainer}>
        <Text onPress={()=>this.writeAddCourses(item)} style={[customStyles.actions, styles.textColor]}>Add To My Courses</Text>
      </View>
      <View style={customStyles.actionsContainer}>
        <Text onPress={()=>Actions.start_exam({courseCode:item.code, courseId:item.key, course:item.name})} style={[customStyles.actions, styles.textColor]}>Practice Exam</Text>
      </View>
      </View>
    }
    </View>
      )
   }
  render () {
    return (
      <View style={styles.container}>
        <NavBar title={this.props.department ? this.props.department : 'All Courses'} />
        <View style={styles.secondaryContainer} >
          <View style={customStyles.container}>
            <View style={{flex:1, flexDirection:'row'}}>{this.renderHeader()}</View>
            <View style={{flex:6, flexDirection:'row'}}>
              {this.state.noSearchResult ?
                <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                  <Text style={[customStyles.listText, styles.textColor]}>:( Nothing Found</Text></View> :
                  <FlatList
                    data={this.state.data}
                    ItemSeparatorComponent={()=><View style={customStyles.separator}></View>}
                    renderItem={this.renderItem}
                    refreshControl={
                     <RefreshControl
                     refreshing={this.state.refreshing}
                        onRefresh={this.retrieveCoursesOnline.bind(this)}
              />
            }
               />
              }
            </View>
          </View>
        </View>
      </View>
    )
  }
}

//Serves as the customized style for this entire page (All added styles for this page needs to be added here and not inside the code!!!)
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
  input: {
    height: 50,
    flex: 1,
    fontSize: 16,
    color:'black',
    backgroundColor: '#fafafa',
    fontFamily:(Platform.OS === 'ios') ? 'Didot' : 'serif',
    borderRadius: 10,
    textAlign: 'center'
  },
  inputContainer: {
    flex: 1,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  icon:{
    marginTop:10,
    resizeMode: 'contain',
    width: 20,
    height: 20,
    alignItems:'flex-end',
  },
})
