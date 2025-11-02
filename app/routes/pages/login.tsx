import {provider, auth} from '../../config/firebase'
import {signInWithPopup} from 'firebase/auth'
//import type firebase from 'firebase/compat/app'
import { redirect, useFetcher, useNavigate } from 'react-router'
import { getUserToken } from './fomsubmit'
import { commitSession, getSession } from '~/config/session.server';







export async function action({ request }: { request: Request }) {
   const formData = await request.formData();
   const token = formData.get("token");
   console.log("Login Action called with token:", token);

   const session =  await getSession();
   
   if (token) {
     session.set("token", token);
   }
return redirect('/',{
      headers: {
         'Set-Cookie': await commitSession(session)
      }
});
}









function Login() {

const navigate = useNavigate()

const fetcher = useFetcher()


const signInWithGoogle = async( event:any)=>{
 event.preventDefault();
  const form = new FormData();
  try{
   const result =  await signInWithPopup(auth,provider)
 console.log('here is thr current',result.user)




const token = await getUserToken();
  
      if (token) {
        form.append("token", token);
      }


      console.log('here is the token',token)




  fetcher.submit(form, { method: "post" });
   
    return

  }catch(e){

    console.log(`there is an error while trying to login: ${e}`)
  }

  
   

}

  return (
    <div> 
        

        <p>Sign in with google to continue</p>
        <fetcher.Form method="post" onSubmit={signInWithGoogle}>
          <button  type='submit'>Sign in with Google</button>
        </fetcher.Form>
    </div>
  )
}

export default Login