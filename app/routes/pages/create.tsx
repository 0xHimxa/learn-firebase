import React from "react";
import { auth } from "../../config/firebase";
import { Form, useFetcher, useNavigate } from "react-router";
import type { Route } from "./+types/create";

import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// to generate unique id for each post i this
import { v4 as uuidv4 } from "uuid";

import { adminAuth,  } from "~/config/admin-auth";

// note auth.currentuser will not work on servier side. because it infor is store in the cliennt side
// so that why we have to get the user token and then verife it in firebase

// here we get the user token

import { handleFormSubmits } from "./fomsubmit";



// to add data to our db import thi

import { addDoc, collection } from "firebase/firestore";

import { db } from "../../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export async function action({ request }: Route.ActionArgs) {
  // return console.log("Action called");
  const formData = await request.formData();
  const title = formData.get("title");
  const content = formData.get("content");
  const userId = formData.get('userId')
  const token = formData.get("token");

  // verify the token on the server side
  let user = null;
  if (token) {
    try {
      // this admin auth verify the token, weather user is signed in or not
      // we imported it
      const decodedToken = await adminAuth.verifyIdToken(token.toString());
      user = decodedToken;
      console.log("Verified user:", user);
    } catch (error) {
      console.error("Error verifying token:", error);
    }



    if(!user)return {message: 'user not found'}

// now  we are handle sending it to db


// specfy collection put our db and the collection name


// due to rule problem that why we use admin db here

const postref = collection(db, 'posts');


// now we add it to our DB


try {
   const sender = await addDoc(postref, {
    postId: uuidv4(),
    title,
    content,
    userName: user.name,
    userId,
  });

} catch (e) {
  console.log('failed to send it to db', (e as Error).message)
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

function CreatePost() {
  const fetcher = useFetcher();
const navigate = useNavigate()
const [user] = useAuthState(auth)
  // for form validation
  // we put in the filed we expect from the users
  const schema = yup.object().shape({
    title: yup.string().required("Title is required"),
    content: yup.string().required("Content is required"),
    userId: yup.string().optional(),

  });

  // the regist add it to the form so that it should be added to the schemma
  // the error is for display input error
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

 
// the main fn is to long that why i did this
  const redirectSubmit = async (data: { title: string; content: string }) => {
    // this is the main function that handle  the post creating and sending to server
    handleFormSubmits(
      { ...data, userId: user?.uid ?? "" },
      fetcher,
      navigate
    );
  };

  return (
    <div>
      <fetcher.Form method="post" onSubmit={handleSubmit(redirectSubmit)}>
        <h1>Create a New Post</h1>
        <input type="text" placeholder="Post Title" {...register("title")} />
        <p style={{ color: "red" }}>{errors.title?.message}</p>

        <br />

        <textarea
          placeholder="Post Content"
          {...register("content")}
        ></textarea>

        <p style={{ color: "red" }}>{errors.content?.message}</p>
        <br />
        <button type="submit">Create Post</button>
      </fetcher.Form>
    </div>
  );
}

export default CreatePost;

// other way of form validation just that this other way take time

// import React from "react";
// import { auth } from "../../config/firebase";
// import { Form, useFetcher } from "react-router";
// import type { Route } from "./+types/create";

// import { adminAuth } from "~/config/admin-auth";

// // note auth.currentuser will not work on servier side. because it infor is store in the cliennt side
// // so that why we have to get the user token and then verife it in firebase

// //here we get the user token

// async function getUserToken() {
//     //console.log("Getting user token...", auth?.currentUser?.getIdToken());
//   if (!auth.currentUser) return null;
//   const token = await auth.currentUser.getIdToken();
//   return token;
// }

// export async function action({ request }: Route.ActionArgs) {

//   // return console.log("Action called");
//   const formData = await request.formData();
//   const title = formData.get("title");
//   const content = formData.get("content");
// const token = formData.get("token");

// // verify the token on the server side
// let user = null
// if(token){

//    try {

//     // this admin auth verify the token, weather user is signed in or not
//     // we imported it
//      const decodedToken = await adminAuth.verifyIdToken(token.toString());
//     user = decodedToken;
//     console.log("Verified user:", user);
//    } catch (error) {
//      console.error("Error verifying token:", error);
//    }
// }

//   // Action logic for creating a post would go here

// //   console.log("Post Created:", {
// //     title,
// //     content,
// //    token
// //   });

//   return null; // or redirect as needed
// }

// function CreatePost() {
//   const fetcher = useFetcher();
//   const [getInputError, setGetInputError] = React.useState<{ titleError?: string; ContentError?: string }>({});

// // now we create a function that pass the user token to the form

// const handleSubmit = async (event: React.FormEvent) => {
//     event.preventDefault();

// // the create a new space for your token data
// // this form contain all the data from the real form
// const form = new FormData(event?.currentTarget as HTMLFormElement);

// const postTile = form.get('title')
// const content = form.get('content')
// const errobject: { [key: string]: string } = {};

// if(postTile == ''){

//   errobject.titleError = ' post title is required'
// }

// if(content == ''){
//   errobject.ContentError = 'post content is required'
// }

// console.log("Submitting form with data:", errobject)

// if (Object.keys(errobject).length > 0) {
//   return setGetInputError(errobject)
// }
// setGetInputError({})
// console.log('Herre am here')

// // get the user token
//  const token = await getUserToken();

//  if (token) {
//      form.append("token", token);
//   }

//    fetcher.submit(form, { method: "post" });

//   }

//   return (
//     <div>
//       <fetcher.Form method="post" onSubmit={handleSubmit}>
//         <h1>Create a New Post</h1>
//         <input type="text" name="title" placeholder="Post Title"  onChange={(e)=>  e.target.value && setGetInputError({})}/>
//         <p> {getInputError?.titleError}</p>
//         <br />
//         <textarea name="content" placeholder="Post Content" ></textarea>
//         <p> {getInputError?.ContentError}</p>

//         <br />
//         <button type="submit">Create Post</button>
//       </fetcher.Form>
//     </div>
//   );
// }

// export default CreatePost;
