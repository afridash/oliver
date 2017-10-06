export function verifyMatch (password, passwordConfirmation) {
  if (password !== passwordConfirmation) {
    return false
  } else {
    return true
  }
}
export function verifyLength (password, passwordConfirmation) {
  if (password.length < 8 || passwordConfirmation < 8) {
    return false
  } else {
    return true
  }
}
export function verifySymbol (password) {
  var symbols = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')']
  var splitStr = password.split('')
  var numOfSymbols = 0
  for (var i = 0; i <= splitStr.length; i++) {
    if (symbols.indexOf(splitStr[i]) > -1) {
      numOfSymbols += 1
    }
  }
  if (numOfSymbols > 0) {
    return true
  } else {
    return false
  }
}
export function verifyNumber (password) {
  var numsArray = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']
  var splitStr = password.split('')
  var nums = 0
  for (var i = 0; i <= splitStr.length; i++) {
    if (numsArray.indexOf(splitStr[i]) > -1) {
      nums += 1
    }
  }
  if (nums > 0) {
    return true
  } else {
    return false
  }
}

export function verifyUppercase (password) {
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  var upperCases = chars.split('')
  var numChars = 0
  var splitStr = password.split('')
  for (var i = 0; i <= splitStr.length; i++) {
    if (upperCases.indexOf(splitStr[i]) > -1) {
      numChars += 1
    }
  }
  if (numChars > 0) {
    return true
  } else {
    return false
  }
}

export function verifyLowercase (password) {
  var lowerCase = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
  var splitStr = password.split('')
  var numChars = 0
  for (var i = 0; i < splitStr.length; i++) {
    if (lowerCase.indexOf(splitStr[i]) > -1) {
      numChars += 1
    }
  }
  if (numChars > 0) {
    return true
  } else {
    return false
  }
}
export function verifyEmail (email) {
  var pattern = /@/
  return pattern.test(email)
}
