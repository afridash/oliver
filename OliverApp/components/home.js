import React, {Component} from 'react'
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  FlatList,
  Platform,
  TextInput
} from 'react-native'
import {Actions} from 'react-native-router-flux'
import theme, { styles } from 'react-native-theme'
import Button from 'react-native-button'
import NavBar from './navBar'
export default class Home extends Component {
  constructor (props) {
    super (props)
    this.state = {
      data:[{key:'1',show:false, name:"Richard Igbiriki",}, {key:'2',show:false, name:"Richard Igbiriki",}, {key:'3',show:false, name:"Richard Igbiriki",}, {key:'4',show:false, name:"Richard Igbiriki",}]
    }
  }
  componentWillMount () {
    //theme.setRoot(this)
  }
  _onPressItem (item) {
    var key
   this.selected = this.state.data.filter((d,index)=> {
     if (item.key === d.key){
       key = index
       return true
     }
  })
  var clone = this.state.data
  clone[key].show = !clone[key].show
  this.setState({data:clone})
}
  _renderItem = ({item}) => (
    <View
      style={customStyles.listItem}
    >
      <Text onPress={()=>this._onPressItem(item)} style={[customStyles.listText, styles.textColor]}>{item.key} {item.name}</Text>
      <View style={{display: item.show ? 'flex' : 'none', }}>
        <View style={customStyles.actionsContainer}>
          <Text style={[customStyles.actions, styles.textColor]}>Study Theory Questions</Text>
        </View>
        <View style={customStyles.actionsContainer}>
          <Text style={[customStyles.actions, styles.textColor]}>Practice Exam</Text>
        </View>
        <View style={customStyles.actionsContainer}>
          <Text style={[customStyles.actions, styles.textColor]}>Bookmark</Text>
        </View>
      </View>
    </View>
  )
  headerComponent () {
    return (
      <View style={{flex:1}}>
        <TextInput
            style={styles.input}
            placeholder='Search'
            onChangeText={(text) => { this.searchFriends(text) }}
          />
      </View>
    )
  }
  render () {
    return (
      <View style={styles.container}>
        <StatusBar
          barStyle="light-content"
        />
        <NavBar />
        <View style={{flex:1}} >
          <View style={customStyles.container}>
            <FlatList
              ListHeaderComponent={this.headerComponent()}
              ItemSeparatorComponent={()=><View style={customStyles.separator}></View>}
              data={this.state.data}
              renderItem={this._renderItem}
            />
          </View>
          <View style={[styles.buttonContainer,customStyles.buttonContainer]}>
            <Button
              containerStyle={styles.secondaryButton}
              style={customStyles.addButton}
              styleDisabled={{color: 'red'}}
              onPress={Actions.add_course}>
              Add Course
            </Button>
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
    flexDirection:'row',
  },
  separator:{
    height:1,
    backgroundColor:'grey',
  },
  buttonContainer:{
    flex:1,
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    borderTopWidth:3,
  },
  addButton : {
    fontSize: 20,
    color: 'white',
    fontFamily:(Platform.OS === 'ios') ? 'Didot' : 'serif',
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
    padding:10,
    fontSize:16,
    fontFamily:(Platform.OS === 'ios') ? 'Didot' : 'serif',
    },
  input: {
  height: 50,
  flex: 1,
  fontSize: 12,
  backgroundColor: 'white',
  fontFamily:(Platform.OS === 'ios') ? 'Didot' : 'serif',
  borderRadius: 10,
  textAlign: 'center'
},
})
