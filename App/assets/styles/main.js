import theme from 'react-native-theme';

theme.add({ // Add default theme
  container: {
    flex: 1,
    backgroundColor:'#424242',
  },
  secondaryContainer: {
    flex:10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    paddingVertical: 20
  },
  secondaryButton:{
    padding:10,
    flex:1,
    height:45,
    overflow:'hidden',
    borderRadius:10,
    backgroundColor: '#757575',
  },
  primaryButton:{
    fontSize:20,
    padding:10,
    textAlign:'center',
    color:'white',
    ios: {
      fontFamily:'Didot',
    },
    android: {
      fontFamily:'serif'
    },
    borderColor:'#fafafa',
    backgroundColor:'#757575',
    margin:5,
  },
  secondaryButton:{
    padding:10,
    flex:1,
    height:45,
    overflow:'hidden',
    borderRadius:10,
    backgroundColor: '#757575',
  },
  signup:{
    flex:1,
    backgroundColor:'#757575',
    justifyContent:'center',
    alignItems:'center'
  },
  subtitle: {
    color:'#f5f5f5',
  },
  login: {
    flex:1.5,
    alignItems:'flex-end',
    justifyContent:'center',
    marginTop:20,
  },
  buttonContainer:{
    borderColor:'grey',
  },
  title: {
    flex:2,
    justifyContent:'center',
    alignItems:'center',
  },
  header:{
    color:'#fafafa',
  },

  image: {
    flex:3,
    alignItems:'center',
    justifyContent:'center',
  },
  logo: {
    flex:1,
    width:  150,
    height:  150,
  },
  information: {
    color:'#f5f5f5',
  },
  scrollView: {
    height: 70
  },
  navBar: {
    borderTopWidth:20,
    borderColor:'#757575',
    backgroundColor: '#616161',
    shadowColor:'#000000',
    shadowOffset:{width: 5, height: 5},
    shadowOpacity:0.5,
    shadowRadius:5,
  },
  textColor:{
    color:'white',
  },
  iconColor:{
    tintColor:'white',
  },
});


theme.add({ // Add LIGHT theme
  container: {
    flex: 1,
    backgroundColor:'#E0E0E0' ,
  },
  secondaryContainer: {
    flex:10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    paddingVertical: 20
  },
  navBar: {
    borderTopWidth:20,
    borderColor:'#0277bd',
    backgroundColor: '#01579b',
    shadowColor:'#000000',
    shadowOffset:{width:5, height: 5},
    shadowOpacity:0.5,
    shadowRadius:5,
  },
  primaryButton:{
    fontSize:20,
    padding:10,
    textAlign:'center',
    color:'white',
    ios: {
      fontFamily:'Didot',
    },
    android: {
      fontFamily:'serif'
    },
    borderColor:'#fafafa',
    backgroundColor:'#0277bd',
    margin:5,
  },
  secondaryButton:{
    padding:10,
    flex:1,
    height:45,
    overflow:'hidden',
    borderRadius:10,
    backgroundColor: '#0277bd',
  },
  loginButton: {
    padding:10,
    textAlign:'center',
    fontSize:20,
    borderWidth:2,
    borderRadius:5,
    color:'white',
    ios: {
      fontFamily:'Didot',
    },
    android: {
      fontFamily:'serif'
    },
    borderColor:'#fafafa',
    backgroundColor:'#0277bd',
    margin:5,
  },
  subtitle: {
    color:'#595959',
  },
  login: {
    flex:1.5,
    alignItems:'flex-end',
    justifyContent:'center',
    marginTop:20,
  },
  title: {
    flex:2,
    justifyContent:'center',
    alignItems:'center',
  },
  header:{
    color:'#595959',
  },

  image: {
    flex:3,
    alignItems:'center',
    justifyContent:'center',
  },
  logo: {
    flex:1,
    width:  150,
    height:  150,
  },
  information: {
    color:'#595959',
  },
  signup:{
    flex:1,
    backgroundColor:'#0277bd',
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
    ios: {
      fontFamily:'Didot',
    },
    android: {
      fontFamily:'serif'
    },
  },
  scrollView: {
    height: 700
  },
  textColor:{
    color:'black',
  },
  iconColor:{
    tintColor:'black',
  },
}, 'light')

theme.add({ // Add BLUE theme
  container: {
    flex: 1,
    backgroundColor:'#1A237E' ,
  },
  secondaryContainer: {
    flex:10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    paddingVertical: 20
  },
  secondaryButton:{
    padding:10,
    flex:1,
    height:45,
    overflow:'hidden',
    borderRadius:10,
    backgroundColor: '#303F9F',
  },
  primaryButton:{
    fontSize:20,
    padding:10,
    textAlign:'center',
    color:'white',
    ios: {
      fontFamily:'Didot',
    },
    android: {
      fontFamily:'serif'
    },
    borderColor:'#fafafa',
    backgroundColor:'#303F9F',
    margin:5,
  },
  signup:{
    flex:1,
    backgroundColor:'#303F9F',
    justifyContent:'center',
    alignItems:'center'
  },
  navBar: {
    borderTopWidth:20,
    borderColor:'#3949ab',
    backgroundColor: '#303f9f',
    shadowColor:'#000000',
    shadowOffset:{width: 5, height: 5},
    shadowOpacity:0.5,
    shadowRadius:5,
  },
  loginButton: {
    padding:10,
    textAlign:'center',
    fontSize:20,
    borderWidth:2,
    borderRadius:5,
    color:'white',
    ios: {
      fontFamily:'Didot',
    },
    android: {
      fontFamily:'serif'
    },
    borderColor:'#fafafa',
    backgroundColor:'#0277bd',
    margin:5,
  },
  subtitle: {
    color:'#E8EAF6',
  },
  login: {
    flex:1.5,
    alignItems:'flex-end',
    justifyContent:'center',
    marginTop:20,
  },
  title: {
    flex:2,
    justifyContent:'center',
    alignItems:'center',
  },
  header:{
    color:'#E8EAF6',
  },

  image: {
    flex:3,
    alignItems:'center',
    justifyContent:'center',
  },
  logo: {
    flex:1,
    width:  150,
    height:  150,
  },
  information: {
    color:'#C5CAE9',
  },
  signup:{
    flex:1,
    backgroundColor:'#0277bd',
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
    ios: {
      fontFamily:'Didot',
    },
    android: {
      fontFamily:'serif'
    },
  },
  scrollView: {
    height: 700
  },
  textColor:{
    color:'white',
  },
  iconColor:{
    tintColor:'white',
  },
}, 'blue')

theme.add({ // Add PURPLE theme
  container: {
    flex: 1,
    backgroundColor:'#4A148C' ,
  },
  secondaryContainer: {
    flex:10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    paddingVertical: 20
  },
  secondaryButton:{
    padding:10,
    flex:1,
    height:45,
    overflow:'hidden',
    borderRadius:10,
    backgroundColor: '#7B1FA2',
  },
  primaryButton:{
    fontSize:20,
    padding:10,
    textAlign:'center',
    color:'white',
    ios: {
      fontFamily:'Didot',
    },
    android: {
      fontFamily:'serif'
    },
    borderColor:'#fafafa',
    backgroundColor:'#7B1FA2',
    margin:5,
  },
  signup:{
    flex:1,
    backgroundColor:'#303F9F',
    justifyContent:'center',
    alignItems:'center'
  },
  navBar: {
      borderTopWidth:20,
      borderColor:'#8E24AA',
      backgroundColor: '#6A1B9A',
      shadowColor:'#000000',
      shadowOffset:{width: 5, height: 5},
      shadowOpacity:0.5,
      shadowRadius:5,
  },
  loginButton: {
    padding:10,
    textAlign:'center',
    fontSize:20,
    borderWidth:2,
    borderRadius:5,
    color:'white',
    ios: {
      fontFamily:'Didot',
    },
    android: {
      fontFamily:'serif'
    },
    borderColor:'#fafafa',
    backgroundColor:'#0277bd',
    margin:5,
  },
  subtitle: {
    color:'#F3E5F5',
  },
  login: {
    flex:1.5,
    alignItems:'flex-end',
    justifyContent:'center',
    marginTop:20,
  },
  title: {
    flex:2,
    justifyContent:'center',
    alignItems:'center',
  },
  header:{
    color:'#F3E5F5',
  },
  image: {
    flex:3,
    alignItems:'center',
    justifyContent:'center',
  },
  logo: {
    flex:1,
    width:  150,
    height:  150,
  },
  information: {
    color:'#E1BEE7',
  },
  signup:{
    flex:1,
    backgroundColor:'#0277bd',
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
    ios: {
      fontFamily:'Didot',
    },
    android: {
      fontFamily:'serif'
    },
  },
  scrollView: {
    height: 700
  },
  textColor:{
    color:'white',
  },
  iconColor:{
    tintColor:'white',
  },
}, 'purple')

theme.add({ // Add PINK theme
  container: {
    flex: 1,
    backgroundColor:'#880E4F' ,
  },
  secondaryContainer: {
    flex:10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    paddingVertical: 20
  },
  secondaryButton:{
    padding:10,
    flex:1,
    height:45,
    overflow:'hidden',
    borderRadius:10,
    backgroundColor: '#D81B60',
  },
  primaryButton:{
    fontSize:20,
    padding:10,
    textAlign:'center',
    color:'white',
    ios: {
      fontFamily:'Didot',
    },
    android: {
      fontFamily:'serif'
    },
    borderColor:'#fafafa',
    backgroundColor:'#D81B60',
    margin:5,
  },
  signup:{
    flex:1,
    backgroundColor:'#303F9F',
    justifyContent:'center',
    alignItems:'center'
  },
  navBar: {
      borderTopWidth:20,
      borderColor:'#EC407A',
      backgroundColor: '#D81B60',
      shadowColor:'#000000',
      shadowOffset:{width: 5, height: 5},
      shadowOpacity:0.5,
      shadowRadius:5,
  },
  loginButton: {
    padding:10,
    textAlign:'center',
    fontSize:20,
    borderWidth:2,
    borderRadius:5,
    color:'white',
    ios: {
      fontFamily:'Didot',
    },
    android: {
      fontFamily:'serif'
    },
    borderColor:'#fafafa',
    backgroundColor:'#0277bd',
    margin:5,
  },
  subtitle: {
    color:'#FCE4EC',
  },
  login: {
    flex:1.5,
    alignItems:'flex-end',
    justifyContent:'center',
    marginTop:20,
  },
  title: {
    flex:2,
    justifyContent:'center',
    alignItems:'center',
  },
  header:{
    color:'#FCE4EC',
  },

  image: {
    flex:3,
    alignItems:'center',
    justifyContent:'center',
  },
  logo: {
    flex:1,
    width:  150,
    height:  150,
  },
  information: {
    color:'#E1BEE7',
  },
  signup:{
    flex:1,
    backgroundColor:'#0277bd',
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
    ios: {
      fontFamily:'Didot',
    },
    android: {
      fontFamily:'serif'
    },
  },
  textColor:{
    color:'white',
  },
  iconColor:{
    tintColor:'white',
  },
  scrollView: {
    height: 700
  },
}, 'pink')
