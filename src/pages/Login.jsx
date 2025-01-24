import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase-config";
import { useNavigate } from "react-router-dom";

const Login = ({ setActiveUser, setActiveUID }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const loginUser = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setActiveUser(email);
      setActiveUID(auth.currentUser.uid);
      navigate("/profile");
      console.log("user login successfully");
    } catch (error) {
      console.log(error.message)
      if(error.code === 'auth/invalid-email'){
        alert("INVALID EMAIL FORMAT");
      }
      if(error.code === "auth/invalid-credential"){
        alert("INVALID PASSWORD")
      }
    }
  };

  return (
    <div className="login h-[92vh] bg-white">
      <div className="login-container w-[1200px] mx-auto h-full">
        <div className="login-wrapper h-full flex flex-col justify-center items-center">
          <div className="login-box flex flex-col justify-center items-center bg-customGreen px-10 py-10 rounded-lg">
            <p className=" text-lg text-white mb-5 font-semibold uppercase">
              Login
            </p>

            <form onSubmit={(e) => loginUser(e)} className=" w-[250px]">
              <input
                type="text"
                id="email"
                className="bg-customdarkenice rounded-lg outline-none px-3 py-2 mb-3 text-sm w-full"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <input
                type="password"
                id="password"
                className=" bg-customdarkenice rounded-lg outline-none px-3 py-2 text-sm w-full"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="sumbit"
                className=" bg-white rounded-lg px-2 py-1 mt-2 text-customGreen uppercase w-full">
                Login
              </button>
            </form>

            <small className=" mt-2">
              Don't have an account?{" "}
              <Link to="/signup" className=" text-white">
                Sign Up
              </Link>
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
