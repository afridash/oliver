import {StyleSheet, Dimensions} from 'react-native'
export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderColor: 'transparent'
  },
  imageGrid: {
    flex: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  image: {
    width: 120,
    height: 100,
    margin: 2
  },
  display: {
    flex: 1,
    backgroundColor: 'transparent',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    position: 'absolute',
    width: Dimensions.get('window').width,
    marginTop: 0,
    height: Dimensions.get('window').height,
    opacity: 0.1
  },
  camera: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  Choices: {
    color: 'white',
    flex: 0,
    marginTop: 10,
    marginRight: 15,
    marginBottom: 20,
    marginLeft: 10,
    fontSize: 16,
    fontFamily: 'verdana',
    textAlign: 'center'
  },
  menu: {
    flex: 0,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: 'black',
    position: 'absolute',
    width: Dimensions.get('window').width,
    opacity: 0.8,
    bottom: 0
  },
  indicator: {
    flex: 0,
    justifyContent: 'center',
    backgroundColor: 'black',
    alignItems: 'center',
    position: 'absolute',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    opacity: 0.8
  }
})
