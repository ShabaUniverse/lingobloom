import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebase/firebase-config";
import { useNavigate } from "react-router-dom";
import { addDoc, collection, setDoc } from "firebase/firestore";
import { doc } from "firebase/firestore";
import { db } from "../firebase/firebase-config"; // Предполагается, что db уже настроен

const Signup = ({ setActiveUser, setActiveUID }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [language, setLanguage] = useState("English"); // Для выбора языка

  const navigate = useNavigate();

  const createUser = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setActiveUser(email);
      setActiveUID(auth.currentUser.uid);
      // Сохранение информации о пользователе в Firestore
      await setDoc(doc(db, "users", auth.currentUser.uid), {
        uid: auth.currentUser.uid,
        name: name,
        email: email,
        language: language,
        followers: 0,
        following:0,
        followingList:[],
        followersList:[],
        chats: []
      });

      navigate("/profile");
      console.log("user signup successfully");
    } catch (error) {
      console.log(error.message);
      if(error.code === "auth/invalid-email"){
        alert('INVALID EMAIL FORMAT')
      }
    }
  };

  return (
    <div className="signup h-[92vh] bg-white">
      <div className="signup-container w-[1200px] mx-auto h-full">
        <div className="signup-wrapper h-full flex flex-col justify-center items-center">
          <div className="signup-box flex flex-col justify-center items-center bg-customGreen px-10 py-10 rounded-lg">
            <p className=" text-lg text-white mb-5 font-semibold uppercase">
              Create Account
            </p>

            <form onSubmit={(e) => createUser(e)} className="w-[250px]">
              <input
                type="text"
                className="rounded-lg outline-none px-3 py-2 mb-3 text-sm w-full"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <input
                type="text"
                className="rounded-lg outline-none px-3 py-2 mb-3 text-sm w-full"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <input
                type="password"
                className="rounded-lg outline-none px-3 py-2 mb-3 text-sm w-full"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <select
                className="rounded-lg outline-none px-3 py-2 mb-3 text-sm w-full"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                required>
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
              </select>

              <button
                type="submit"
                className="bg-white rounded-lg px-2 py-1 mt-2 text-customGreen uppercase w-full">
                Sign Up
              </button>
            </form>

            <small className="mt-2">
              Already have an account?{" "}
              <Link to="/login" className="text-white">
                Login
              </Link>
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
