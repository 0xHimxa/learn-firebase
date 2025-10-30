import React from 'react'
import {auth} from '../../config/firebase'
function Main() {
  
  return (
    <div>Welocme to home page {auth.currentUser ? `${auth.currentUser?.displayName}` : "Please log in"}</div>
  )
}

export default Main