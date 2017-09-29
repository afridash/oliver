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
    backgroundColor:'#424242',
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
}, 'light')

theme.add({ // Add BLUE theme
  container: {
    flex: 1,
    backgroundColor:'#C5CAE9' ,
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
    color:'#1A237E',
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
    color:'#283593',
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
    color:'#1A237E',
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
}, 'blue')
