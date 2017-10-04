import React, {Component} from 'react'
import {View,Text,AsyncStorage,Picker,Modal,TouchableHighlight, Platform} from 'react-native'
import Button from 'react-native-button'
import {Actions} from 'react-native-router-flux'
import theme, { styles } from 'react-native-theme'
import NavBar from './navBar'
export default class Add extends Component {
  constructor (props) {
    super (props)
    this.state = {
      modalVisible:false,
      modalVisible2:false
    }
  }
  componentWillMount () {
    theme.setRoot(this)
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
    <View>
      <Text>Hello World!</Text>

      <TouchableHighlight onPress={() =>
        this.setState({modalVisible:!this.state.modalVisible})}>
        <Text>Hide Modal</Text>
      </TouchableHighlight>

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
    <View>
      <Text>Show courses</Text>

      <TouchableHighlight onPress={() =>
        this.setState({modalVisible2:!this.state.modalVisible2})}>
        <Text>Hide Modal</Text>
      </TouchableHighlight>

    </View>
   </View>
  </Modal>
    )
  }
  render () {
    return (
      <View style={styles.container}>
        <NavBar title='Add Course' />
        <View style={addStyles.top}></View>
        <View style={styles.secondaryContainer} >
          <View style={addStyles.box}>
            <View style={{flex:1, justifyContent:'center', alignItems:'flex-end', flexDirection:'row'}}>
              <Text style={addStyles.item} onPress={()=>this.setState({modalVisible:!this.state.modalVisible})}><Text>Faculty</Text></Text>
            </View>
            <View style={{flex:1, justifyContent:'center', alignItems:'flex-start', flexDirection:'row'}}>
               <Text style={addStyles.item}  onPress={()=>this.setState({modalVisible2:!this.state.modalVisible2})}>Courses</Text>
            </View>
          <View style={addStyles.buttonContainer}>
            <Button
              containerStyle={[styles.secondaryButton, addStyles.secondaryButton]}
              style={addStyles.addButton}
              styleDisabled={{color: 'red'}}
              onPress={Actions.add_course}>
              Continue
            </Button>
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
  header:{
    flex:1,
  },
  item:{
    flex:1,
    flexDirection:'row',
    borderRadius:7,
    margin:5,
    borderWidth:2,
    fontSize:20,
    padding:10,
    textAlign:'center',
    borderColor:'grey',
  },
  addButton:{
    fontSize: 20,
    color: 'white',
    fontFamily:(Platform.OS === 'ios') ? 'Didot' : 'serif',
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
