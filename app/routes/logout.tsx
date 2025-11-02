import { redirect } from "react-router";
import { signOut } from "firebase/auth"; // adjust path to your firebase config
import { auth } from "../config/firebase";
import { destroySession, getSession } from "~/config/session.server";
import type { Route } from "../+types/root";

export async function action({request}: Route.ActionArgs) {
   
  console.log('bben called')
  
  const cookieHeader = request.headers.get("Cookie");

  // Decode session
  const session = await getSession(cookieHeader);

  // Destroy it
  return redirect("/login", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}

export default function Logout() {
  // This page never actually renders, since we only POST to it
  return null;
}
