/*
--Notifications Tree--
->notifications
  -> notification

--User Notifications Tree--
->user_notifications
 ->userId
  ->notificationKey

--Badges Tree --
->badges
  ->userId
    ->notificationType
      ->badgeCount
*/
import {Firebase} from './firebase'
const firebase = require('firebase')

export function sendNotification (userKey, type, key , post='', code='', course='') {
  this.user = firebase.auth().currentUser
  this.notificationsRef = firebase.database().ref('notifications')
  this.userNotificationsRef = firebase.database().ref('user_notifications')
  this.badgesRef = firebase.database().ref().child('badges')
  if (userKey !== this.user.uid) {
    var postData = {
      userId: this.user.uid,
      profilePicture: this.user.photoURL,
      displayName: this.user.displayName,
      type: type,
      postId: key,
      post:post,
      code:code,
      course:course,
      receiverId:userKey,
      createdAt: firebase.database.ServerValue.TIMESTAMP
    }
    var item = this.notificationsRef.child(userKey).push()
    item.setWithPriority(postData, 0 - Date.now())
    //Save notification badge
    if (type === 'accepted_request' || type === 'friend_request') {
      this.badgesRef.child(userKey).child('friendsBadges').once('value', (badgeCount)=>{
        if (badgeCount.val()) badgeCount.ref.set(badgeCount.val()+1)
        else badgeCount.ref.set(1)
      })
    }else {
      this.badgesRef.child(userKey).child('notificationsBadges').once('value', (badgeCount)=>{
        if (badgeCount.val()) badgeCount.ref.set(badgeCount.val()+1)
        else badgeCount.ref.set(1)
      })
    }
  }
}
