import React from 'react';
import { StyleSheet, Text, View , Image, TouchableHighlight, Alert, Platform} from 'react-native';

export default class App extends React.Component {
  _handlePress = () => {
    Alert.alert('Clicked')
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.login}>
          <Text style={styles.loginButton}>Log in</Text>
        </View>
        <View style={styles.secondaryContainer}>
          <View style={styles.title}><Text style={styles.header}>Oliver</Text>
          <Text style={styles.subtitle}>Exam Prep Simplified</Text>
        </View>
          <View style={styles.image}><Image
           style={{width: 200, height: 200}}
           source={{uri: 'https://facebook.github.io/react/img/logo_og.png'}}
         />
         <Text style={styles.information}>Find courses from your institution</Text>
       </View>
         </View>
         <TouchableHighlight style={styles.signup} onPress={this._handlePress}>
           <Text style={styles.signupButton}>Create Account</Text>
         </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#424242',
  },
  secondaryContainer: {
    flex:10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  login: {
    flex:1.5,
    alignItems:'flex-end',
    justifyContent:'center',
    marginTop:20,
  },
  loginButton: {
    padding:10,
    textAlign:'center',
    fontSize:20,
    borderWidth:2,
    borderRadius:5,
    color:'white',
    fontFamily:(Platform.OS === 'ios') ? 'Didot' : 'serif',
    borderColor:'#fafafa',
    backgroundColor:'#0277bd',
    margin:5,
  },
  title: {
    flex:2,
    justifyContent:'center',
    alignItems:'center',
  },
  header:{
    fontSize:100,
    fontFamily:(Platform.OS === 'ios') ? 'Didot' : 'serif',
    color:'#fafafa',
  },
  subtitle: {
    fontSize:35,
    fontFamily:(Platform.OS === 'ios') ? 'Didot' : 'serif',
    textShadowColor:'#01579b',
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius:2,
    color:'#f5f5f5',
  },
  image: {
    flex:3,
    alignItems:'center',
    justifyContent:'center',
  },
  information: {
    fontSize:20,
    fontFamily:(Platform.OS === 'ios') ? 'Didot' : 'serif',
    color:'#f5f5f5',
    padding:10,
  },
  signup:{
    flex:1,
    backgroundColor:'#757575',
    justifyContent:'center',
    alignItems:'center'
  },
  signupButton: {
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    textAlign:'center',
    fontSize:25,
    padding:10,
    color:'white',
    fontFamily:(Platform.OS === 'ios') ? 'Didot' : 'serif',
  },

});
