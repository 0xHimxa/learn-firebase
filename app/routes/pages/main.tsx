import React, { use, useState } from "react";
import { auth, db } from "../../config/firebase";

import type { Route } from "./+types/main";
import { getUserToken } from "./fomsubmit";
import { getSession } from "~/config/session.server";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { redirect, useFetcher } from "react-router";
import { adminAuth } from "~/config/admin-auth";
import { useAuthState } from "react-firebase-hooks/auth";

export async function loader({ request }: Route.LoaderArgs) {
  // return console.log("Loader called");
  const cookie = request.headers.get("Cookie");
  //here we can get the session from the cookie if we want to do something with it
  const session = await getSession(cookie);
  const token = session.get("token");

  let decodedToken = null;

  if (token) {
    try {
      decodedToken = await adminAuth.verifyIdToken(token.toString());
    } catch (error) {
      console.error("Error verifying token:", error);
    }
  }

  if (!decodedToken) {
    // If the token is missing or verification failed, throw a redirect to the login page
    // The path should be the actual path to your login route.
    throw redirect("/login");
  }
  console.log("Decoded token in loader:", decodedToken);

  const specifilocdata = collection(db, "posts");

  let postsData = null;

  if (decodedToken) {
    try {
      const querySnapshot = await getDocs(specifilocdata);
      // console.log(`posts data: ${querySnapshot.docs.map((doc)=> ({id: doc.id, ...doc.data()}))}`);
      postsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      //console.log('posts data inside loader',postsData)
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  }

  //console.log("Loader called with token:", token);

  if (postsData) {
    const postLikesref = collection(db, "likes");
    const postWithlikesPromise = postsData.map(async (post: any) => {
      console.log("positd", post.postId);
      const specifipost = query(
        postLikesref,
        where("postId", "==", post.postId)
      );

      let filterd = null;
      try {
        const postsDocs = await getDocs(specifipost);

        filterd = postsDocs.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      } catch (error) {
        return console.log("eerror geting post likes", error);
      }

      console.log(filterd, "Likes");
      return { ...post, postLike: filterd };
    });
    const postWithlikes = await Promise.all(postWithlikesPromise);

    return { posts: postWithlikes };
  }

  return null;
}

export async function action({ request }: Route.ActionArgs) {
  const formdata = await request.formData();
  const userId = formdata.get("userId");
  const postId = formdata.get("postId");
  const removeLike:any = formdata.get("remove");
  console.log(userId, "from poast action");
  const likesCol = collection(db, "likes");

   if (removeLike != 'add') {

    console.log(removeLike, 'haha working')
    const likeToDeleteQuery = query(
      likesCol,
       where("postId", "==", postId),
       where("userId", "==", userId)
     );

    const likeTodeleteData = await getDocs(likeToDeleteQuery)

   //console.log('enters', likeTodeleteData.docs[0].id)

    // // the doc over here  accept our db,the collection which is like the the id of the document 
   

    //you can use the as the last doc value and it will still work likeTodeleteData.docs[0].id
   
    const likeTodelete = doc(db,'likes',removeLike)

     await deleteDoc(likeTodelete)
   console.log('enters')
    return
  }

  try {
    const added = await addDoc(likesCol, {
      userId,
      postId,
    });
  } catch (error) {
    console.log("faild to add like eeror", error);
  }

  // console.log(postId, 'working')
}

function Main({ loaderData }: { loaderData: any }) {
  const fetcher = useFetcher();
  const posts = loaderData?.posts || [];
  const [user] = useAuthState(auth);
  const [hasuserlike, setUserLiked] = useState(false);
  console.log(posts[0].postLike, "poster");

  return (
    <div>
      Welocme to home page{" "}
      {auth.currentUser ? `${auth.currentUser?.displayName}` : "Please log in"}
      {posts.map((post: any) => {
        const ispostLikebyUser = post.postLike.some(
          (useLike: any) => useLike.userId === user?.uid
        );

        const postLikedocId = post.postLike.find((docId:any)=> docId.userId === user?.uid)




        return (
          <div
            key={post.id}
            style={{ backgroundColor: "gray", margin: "10px", padding: "10px" }}
          >
            <h2>{post.title}</h2>
            <p>{post.content}</p>

            <fetcher.Form method="post">
              <input type="hidden" name="postId" value={post.postId} />
              <input type="hidden" name="userId" value={user?.uid} />
              <input type="hidden" name="remove" value={ispostLikebyUser? postLikedocId.id :'add'} />

              <button>
                {" "}
                {ispostLikebyUser ? <> &#128078;</> : <>&#128077; </>}
              </button>
              <p>{post.postLike.length}</p>
            </fetcher.Form>
          </div>
        );
      })}
    </div>
  );
}

export default Main;
