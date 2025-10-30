import {provider, auth} from '../../config/firebase'
import {signInWithPopup} from 'firebase/auth'
import type firebase from 'firebase/compat/app'
import { useNavigate } from 'react-router'

function Login() {

const navigate = useNavigate()



const signInWithGoogle = async()=>{
  try{
   const result =  await signInWithPopup(auth,provider)
 console.log(result)

    navigate('/')
    return

  }catch(e){

    console.log(`there is an error while trying to login: ${e}`)
  }


}

  return (
    <div> 
        

        <p>Sign in with google to continue</p>
        <button  onClick={signInWithGoogle}>Sign in with Google</button>
    </div>
  )
}

export default Login