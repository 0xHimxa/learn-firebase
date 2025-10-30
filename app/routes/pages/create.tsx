import React from "react";
import { auth } from "../../config/firebase";
import { Form, useFetcher } from "react-router";
import type { Route } from "./+types/create";

import { adminAuth } from "~/config/admin-auth";

// note auth.currentuser will not work on servier side. because it infor is store in the cliennt side
// so that why we have to get the user token and then verife it in firebase


//here we get the user token

async function getUserToken() {
    //console.log("Getting user token...", auth?.currentUser?.getIdToken());
  if (!auth.currentUser) return null;
  const token = await auth.currentUser.getIdToken();
  return token;
}


export async function action({ request }: Route.ActionArgs) {
  


  
  // return console.log("Action called");
  const formData = await request.formData();
  const title = formData.get("title");
  const content = formData.get("content");
const token = formData.get("token");
 


// verify the token on the server side 
let user = null
if(token){

   try {


    // this admin auth verify the token, weather user is signed in or not
    // we imported it 
     const decodedToken = await adminAuth.verifyIdToken(token.toString());
    user = decodedToken;
    console.log("Verified user:", user);
   } catch (error) {
     console.error("Error verifying token:", error);
   }
}














  // Action logic for creating a post would go here

//   console.log("Post Created:", {
//     title,
//     content,
//    token
//   });






  return null; // or redirect as needed
}

function CreatePoist() {
  const fetcher = useFetcher();


// now we create a function that pass the user token to the form


const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

// the create a new space for your token data

const form = new FormData(event?.currentTarget as HTMLFormElement);

// get the user token
const token = await getUserToken();

if (token) {
      form.append("token", token);
    }


    fetcher.submit(form, { method: "post" });



   
   

  }





  return (
    <div>
      <fetcher.Form method="post" onSubmit={handleSubmit}>
        <h1>Create a New Post</h1>
        <input type="text" name="title" placeholder="Post Title" required />
        <br />
        <textarea name="content" placeholder="Post Content" required></textarea>
        <br />
        <button type="submit">Create Post</button>
      </fetcher.Form>
    </div>
  );
}

export default CreatePoist;
