import theme from 'react-native-theme';

theme.add({ // Add default theme
  container: {
    flex: 1,
    backgroundColor:'#424242' ,
  },
  secondaryContainer: {
    flex:10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    paddingVertical: 20
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
  signup:{
    flex:1,
    backgroundColor:'#757575',
    justifyContent:'center',
    alignItems:'center'
  },
  subtitle: {
    fontSize:35,
    ios: {
      fontFamily:'Didot',
    },
    android: {
      fontFamily:'sans-serif'
    },
    textShadowColor:'#01579b',
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius:2,
    color:'#f5f5f5',
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
    fontSize:100,
    ios: {
      fontFamily:'Didot',
    },
    android: {
      fontFamily:'serif'
    },
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
    fontSize:20,
    ios: {
      fontFamily:'Didot',
    },
    android: {
      fontFamily:'serif'
    },
    color:'#f5f5f5',
    padding:10,
  },
  scrollView: {
    height: 700
  },
  navBar: {
    backgroundColor:'#424242',
  },
});

theme.add({
  container: {
    flex: 1,
    backgroundColor:'#FFFFFF' ,
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
    backgroundColor:'white',
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
    fontSize:35,
    ios: {
      fontFamily:'Didot',
    },
    android: {
      fontFamily:'sans-serif'
    },
    textShadowColor:'#01579b',
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius:2,
    color:'#f5f5f5',
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
    fontSize:100,
    ios: {
      fontFamily:'Didot',
    },
    android: {
      fontFamily:'serif'
    },
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
    fontSize:20,
    ios: {
      fontFamily:'Didot',
    },
    android: {
      fontFamily:'serif'
    },
    color:'#f5f5f5',
    padding:10,
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
}, 'light')
