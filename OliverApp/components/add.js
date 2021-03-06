import React, {Component} from 'react'
import {View,Text,AsyncStorage,Picker,Modal,TouchableHighlight, Platform, FlatList, Image, Alert} from 'react-native'
import Button from 'react-native-button'
import Firebase from '../auth/firebase'
const firebase = require('firebase')
import {Actions} from 'react-native-router-flux'
import theme, { styles } from 'react-native-theme'
import NavBar from './navBar'
export default class Add extends Component {
  constructor (props) {
    super (props)
    this.state = {
      faculty:[],
      department:[],
      name:'',
      code:'',
      modalVisible:false,
      modalVisible2:false,
      pickedFaculty:'Faculty',
      pickedDepartment:'Department',
    }
    this.faculty = this.state.faculty
    this.department = this.state.department
    this.renderItem = this.renderItem.bind(this)
  }

  async componentWillMount () {
    theme.setRoot(this)
    var collegeId = await AsyncStorage.getItem('collegeId')
    this.setState({collegeId:collegeId})
    this.retrieveFaculty()
  }
  retrieveFaculty() {
        // Retrieve users faculties from their respective college from firebase
    this.faculty = []
     firebase.database().ref().child('faculties').child(this.state.collegeId).once('value', (snapshot)=>{
      snapshot.forEach((faculty)=>{
        this.faculty.push({key:faculty.key, name:faculty.val(), type:'faculty'})
        this.setState({faculty:this.faculty})
      })
    })
  }
  retrieveDepartment(faculty) {
        // Retrieve users faculties from their respective college from firebase
    this.faculty = []
     firebase.database().ref().child('departments').child(faculty).once('value', (snapshot)=>{
      snapshot.forEach((department)=>{
        this.department.push({key:department.key, name:department.val()})
        this.setState({department:this.department})
      })
    })
  }
  _onPressItem (index, type) {
    if (type ==='faculty')
    {
      this.retrieveDepartment(this.state.faculty[index].key)
      this.setState({pickedFaculty:this.state.faculty[index].name, modalVisible:false})
    }
    else this.setState({pickedDepartment:this.state.department[index].name, selectedKey:this.state.department[index].key, modalVisible2:false})
  }
  renderItem({ item, index }) {
   return (
     <View
      style={addStyles.listItem}
    >
      <Text onPress={()=>this._onPressItem(index, item.type)} style={[addStyles.listText, styles.textColor]}>{item.name}</Text>

    </View>
      )
   }
  showfacultyModal () {
    return  (
      <Modal
    animationType={"slide"}
    transparent={false}
    visible={this.state.modalVisible}
    onRequestClose={() => {alert("Modal has been closed.")}}
    >
   <View style={styles.container}>
    <View style={addStyles.flatList}>
      <FlatList
        data={this.state.faculty}
        ItemSeparatorComponent={()=><View style={addStyles.separator}></View>}
        renderItem={this.renderItem}
        />
    </View>
      <View style={addStyles.buttonContainer}>
        <Button
          containerStyle={[styles.secondaryButton, addStyles.secondaryButton]}
          style={addStyles.addButton}
          styleDisabled={{color: 'red'}}
          onPress={()=>this.setState({modalVisible:!this.state.modalVisible})}>
          Close
        </Button>
      </View>
   </View>
 </Modal>
    )
  }

  showcourseModal () {
    return  (
      <Modal
    animationType={"slide"}
    transparent={false}
    visible={this.state.modalVisible2}
    onRequestClose={() => {alert("Modal has been closed.")}}
    >
      <View style={styles.container}>
       <View style={addStyles.flatList}>
         <FlatList
           data={this.state.department}
           ItemSeparatorComponent={()=><View style={addStyles.separator}></View>}
           renderItem={this.renderItem}
           />
       </View>
         <View style={addStyles.buttonContainer}>
           <Button
             containerStyle={[styles.secondaryButton, addStyles.secondaryButton]}
             style={addStyles.addButton}
             styleDisabled={{color: 'red'}}
             onPress={()=>this.setState({modalVisible2:!this.state.modalVisible2})}>
             Close
           </Button>
         </View>
      </View>
  </Modal>
    )
  }
  render () {
    return (
      <View style={styles.container}>
        <NavBar title='Add Course'/>
        <View style={addStyles.top}></View>
        <View style={styles.secondaryContainer}>
          <View style={addStyles.box}>
              <TouchableHighlight
                underlayColor={'transparent'}
                onPress={()=>this.setState({modalVisible:!this.state.modalVisible})} style={addStyles.boxItem} >
                <View style={addStyles.itemContainer}>
                  <Text style={addStyles.item} >{this.state.pickedFaculty}</Text>
                  <Image source={require('../assets/images/arrow_right.png')} style={[addStyles.home]} />
                </View>
              </TouchableHighlight>
              <TouchableHighlight
                underlayColor={'transparent'}
                style={addStyles.boxItem} onPress={()=>this.setState({modalVisible2:!this.state.modalVisible2})}>
                  <View style={addStyles.itemContainer}>
                    <Text style={addStyles.item}>{this.state.pickedDepartment}</Text>
                    <Image source={require('../assets/images/arrow_right.png')} style={[addStyles.home]} />
                  </View>
              </TouchableHighlight>
          <View
            style={addStyles.buttonContainer}>
             {this.state.pickedDepartment !== 'Department' && this.state.pickedFaculty !== 'Faculty' && <Button
              containerStyle={[styles.secondaryButton, addStyles.secondaryButton]}
              style={addStyles.addButton}
              styleDisabled={{color: 'red'}}
              onPress={()=> Actions.courses({department:this.state.pickedDepartment, departmentKey:this.state.selectedKey})}>
              Continue
            </Button>}
          </View>
          </View>
          <View style={addStyles.header}></View>
        </View>
          {this.showfacultyModal()}
          {this.showcourseModal()}
      </View>
    )
  }
}
const addStyles ={
  top:{
    flex:1,
  },
  box:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    shadowColor:'#000000',
    shadowOffset:{width: 10, height: 10},
    width: 250,
    height:250,
    shadowOpacity:0.5,
    shadowRadius:5,
    borderWidth:5,
    borderColor:'white',
    margin:40,
    backgroundColor:'white',
    borderRadius:10,
  },
  boxItem:{
    flex:1,
    justifyContent:'flex-end',
    alignItems:'center'
  },
  header:{
    flex:1,
  },
  home:{
    resizeMode: 'contain',
    width: 25,
    height: 25,
  },
  itemContainer:{
    flex:1,
    justifyContent:'space-between',
    flexDirection:'row',
    alignItems:'center',
     borderWidth:2,
     borderColor:'grey',
     borderRadius:10,
     margin:10
   },
  item:{
    flex:1,
    flexDirection:'row',
    borderRadius:7,
    margin:5,
    fontSize:16,
    fontFamily:(Platform.OS === 'ios') ? 'verdana' : 'serif',
  },
  listText:{
    fontSize:18,
    fontWeight:'400',
    fontFamily:(Platform.OS === 'ios') ? 'verdana' : 'serif',
    margin:5,
  },
  listItem:{
    padding:15,
  },
  separator:{
    height:1,
    backgroundColor:'grey',
  },
  flatList:{
    marginTop:20,
    flex:8,
  },
  addButton:{
    fontSize: 18,
    color: 'white',
    fontFamily:(Platform.OS === 'ios') ? 'verdana' : 'serif',
  },
  icon:{
    marginTop:20,
    resizeMode: 'contain',
    width: 20,
    height: 20,
    alignItems:'flex-end',
  },
  buttonContainer:{
    flex:1,
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',

  },
  secondaryButton: {
    padding:10,
    flex:1,
    height:45,
    overflow:'hidden',
    borderRadius:10,
  },
}
