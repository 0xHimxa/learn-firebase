import { NavLink } from "react-router";
import { auth } from "../config/firebase";
import { signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router";
// the auth will help us to know if the user is logged in or not
// also contain info about the user

function Navbar() {
 // console.log(auth.currentUser);

  // the useauthsrate display realtime without need to refress
  // you have to install react firebase hooks this help more in the updat
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const signUserOut = async () => {
    try {
      await signOut(auth);
      return  await navigate("/login");
    } catch (e) {
      console.log(`error signing out: ${e}`);
    }
  };
  return (
    <div
      style={{
        backgroundColor: "brown",
        display: "flex",
        justifyContent: "flex-end",
        padding: "10px",
      }}
    >
      <NavLink
        to="/"
        style={({ isActive }) => ({
          backgroundColor: isActive ? "red" : "blue",
          padding: "5px",
          margin: "5px",
          width: "50px",
          height: "50px",
        })}
      >
        Home
      </NavLink>




      {user?  <NavLink
        to="/createpost"
        style={({ isActive }) => ({
          backgroundColor: isActive ? "red" : "blue",
          padding: "5px",
          margin: "5px",
          width: "70px",
          height: "50px",
        })}
      >
        Create Post
      </NavLink>
:  <NavLink
        to="/login"
        style={({ isActive }) => ({
          backgroundColor: isActive ? "red" : "blue",
          padding: "5px",
          margin: "5px",
          width: "50px",
          height: "50px",
        })}
      >
        Login
      </NavLink>}
      




     
      <div style={{ margin: "10px" }}>
        {user && <img src={user?.photoURL || ""} alt="Profile" width="100" />}
        <h2>{user ? `Welcome ${user?.displayName}` : "Please log in"}</h2>

        {user && <button onClick={signUserOut}>log out</button>}
      </div>
    </div>
  );
}

export default Navbar;
