import {StyleSheet} from 'react-native'
export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10
  },
  header: {
    flex: 0.1,
    flexDirection: 'row',
    justifyContent: 'center',
    height: 30
  },
  headerContent: {
    flex: 3,
    flexDirection: 'row'
  },
  headerSpace: {
    flex: 9
  },
  profileContents: {
    flex: 1,
    justifyContent: 'space-between'
  },
  headerText: {
    color: 'blue',
    marginTop: 12,
    fontSize: 16,
    fontFamily: 'Didot'
  },
  inputFields: {
    flex: 1,
    alignItems: 'stretch',
    textAlign: 'left',
    fontSize: 15,
    fontFamily: 'Didot'
  },
  inputDIV: {
    flex: 1,
    borderBottomWidth: 0.5,
    margin: 10,
    borderColor: 'rgb(218, 223, 225)'
  },
  status: {
    flex: 2,
    margin: 10,
    height: 100
  },
  multilineDIV: {
    flex: 1,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: 'rgb(218, 223, 225)'
  },
  space: {
    flex: 5
  },

  textInfo: {
    color: 'black',
    fontFamily: 'Didot',
    fontSize: 14,
    margin: 10
  },

  linkContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  }
})
