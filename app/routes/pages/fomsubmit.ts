import {auth} from '../../config/firebase' 



// this get user TOken that will be use to verify if they are login or not


export async function getUserToken(name = null) {
    //console.log("Getting user token...", auth?.currentUser?.getIdToken());

if (name){
  
}

  if (!auth.currentUser) return null;
  const token = await auth.currentUser.getIdToken();

  return token;
}




export const handleFormSubmits = async (data: { title: string; content: string; userId: string },fetcher:any,navigate:any) => {

  // this part create a formdata how ours server expect it to come
    const form = new FormData();
  const userId = auth.currentUser?.uid
    // add each filed to it
    form.append("title", data.title);
    form.append("content", data.content);
     form.append ('userId',  data.userId)

    console.log("Submitting form with data:", data);
    // get the user token
    const token = await getUserToken();

    if (token) {
      form.append("token", token);
    }

    fetcher.submit(form, { method: "post" });
    navigate("/");
  }