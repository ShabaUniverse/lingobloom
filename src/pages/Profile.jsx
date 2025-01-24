import React, { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth, db, storage } from "../firebase/firebase-config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"; // Firebase storage functions
import { Link, useNavigate } from "react-router-dom";

import Pending from "../components/Pending";

import dudeProfileSVG from "../assets/illustrations/dudeProfileSVG.svg";

import blob1 from "../assets/blobs/blob1.svg"
import blob2 from "../assets/blobs/blob2.svg"
import blob3 from "../assets/blobs/blob3.svg"

const Profile = ({ activeUser, setActiveUser, activeUID, setActiveUID }) => {
  const navigate = useNavigate();

  // visible states
  const [customizeActive, setCustomizeActive] = useState(false);
  const [isPending, setIsPending] = useState(false);

  // states to update user profile
  const [userName, setUserName] = useState("");
  const [activeName, setActiveName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [languageLevel, setLanguageLevel] = useState(1);
  const [profilePic, setProfilePic] = useState(null); // for selected file
  const [profilePicURL, setProfilePicURL] = useState(""); // for profile picture URL
  const [userProgress, setUserProgress] = useState(0);

  // firestore data states
  const [user, setUser] = useState(null);

  // Fetch user data from Firestore on component mount
  useEffect(() => {
    const getData = async () => {
      setIsPending(true);
      try {
        if (activeUID) {
          const docRef = doc(db, "users", activeUID);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const userData = docSnap.data();
            setUser(userData);
            setUserName(userData.name || "");
            setActiveName(userData.name || "");
            setAge(userData.age || "");
            setGender(userData.gender || "");
            setLanguageLevel(userData.languageLevel || 1);
            setProfilePicURL(userData.profilePicURL || ""); // Set profile picture URL
            setUserProgress(userData.progress);
          } else {
            console.log("No such document!");
          }
        }
      } catch (error) {
        console.log("Error getting document:", error);
      } finally {
        setIsPending(false);
      }
    };
    getData();
  }, [activeUID]);

  // LOGOUT
  const logout = async () => {
    try {
      await signOut(auth);
      setActiveUser("");
      setActiveUID("");
      setAge(null);
      setLanguageLevel(null);
      setGender(null);
      setProfilePicURL(null);
      navigate("/");
      console.log("User signed out successfully");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  // Upload image to Firebase Storage
  const uploadImage = async () => {
    if (profilePic) {
      const storageRef = ref(storage, `profilePictures/${activeUID}`);
      setIsPending(true);
      try {
        const snapshot = await uploadBytes(storageRef, profilePic);
        const downloadURL = await getDownloadURL(snapshot.ref);
        setProfilePicURL(downloadURL); // Set the URL in state

        // Save the URL to Firestore
        const userRef = doc(db, "users", activeUID);
        await updateDoc(userRef, { profilePicURL: downloadURL });
        console.log("Profile picture uploaded successfully!");
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setIsPending(false);
      }
    }
  };

  // SUBMIT DATA TO FIRESTORE
  const submitInfo = async () => {
    setIsPending(true);
    try {
      const userRef = doc(db, "users", activeUID);
      await updateDoc(userRef, {
        name: userName,
        age: age,
        gender: gender,
        languageLevel: languageLevel,
      });
      console.log("Profile updated successfully!");
      await uploadImage(); // Upload the profile picture if a new one is selected
      const updatedDoc = await getDoc(userRef);
      setUser(updatedDoc.data());
      setCustomizeActive(false); // Close the customize panel after submission
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="profile">
      <img
        src={dudeProfileSVG}
        alt=""
        className=" w-[400px] absolute right-[200px] top-[120px] -z-10"
      />
      {isPending && <Pending />}
      <div className="profile-container w-[1200px] mx-auto">
        <div className="profile-wrapper pt-10">
          <button
            className="bg-customGreen text-white rounded-xl px-3 py-1"
            onClick={() => setCustomizeActive(!customizeActive)}>
            Customize Profile {customizeActive ? "⮝" : "⮟"}
          </button>

          <button
            className="bg-red-300 rounded-lg py-1 px-3 ml-2 text-white hover:bg-customPink mb-5"
            onClick={logout}>
            Logout
          </button>

          <div
            className={`transition-all duration-500 ease-in-out overflow-hidden z-20 w-[600px] ${
              customizeActive
                ? "max-h-[1000px] opacity-100"
                : "max-h-0 opacity-0"
            } p-2 my-5 flex flex-col justify-start items-start bg-customGreen rounded-xl z-20`}>
            <label htmlFor="name" className="text-white">
              Name:
            </label>
            <input
              id="name"
              type="text"
              className="bg-white w-[150px] outline-none px-2 rounded-md"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />

            <label htmlFor="age" className="text-white">
              Age:
            </label>
            <input
              type="number"
              id="age"
              className="bg-white w-[150px] outline-none px-2 rounded-md"
              placeholder="18"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />

            <label htmlFor="gender" className="text-white">
              Gender:
            </label>
            <select
              name="gender"
              id="gender"
              className="bg-white outline-none border-none px-2 rounded-md w-[150px]"
              value={gender}
              onChange={(e) => setGender(e.target.value)}>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>

            <label htmlFor="languageLevel" className="text-white">
              Language Level (1 - Beginner, 6 - Proficient):
            </label>
            <input
              type="range"
              id="languageLevel"
              name="languageLevel"
              min="1"
              max="6"
              value={languageLevel}
              onChange={(e) => setLanguageLevel(e.target.value)}
            />

            {/* File input for profile picture */}
            <label htmlFor="profilePic" className="text-white">
              Profile Picture:
            </label>
            <input
              className="text-white"
              type="file"
              id="profilePic"
              accept="image/*"
              onChange={(e) => setProfilePic(e.target.files[0])}
            />
            <br />

            <button
              className="px-3 py-1 bg-white rounded-lg mt-2 text-customBlack hover:bg-customPink"
              onClick={submitInfo}>
              Submit changes
            </button>
          </div>

          {/* Display user data */}
          {user && (
            <div className="flex justify-start items-center bg-transparent text-customBlack p-4 rounded-xl w-[600px] relative">
              <img src={blob1} alt="" className=" absolute bottom-[-100px] left-[100px] -z-50 w-[300px]"/>
              <img src={blob2} alt="" className=" absolute top-0 left-[400px] -z-50 w-[300px]"/>
              <img src={blob3} alt="" className=" absolute top-[-100px] left-[200px] -z-50 w-[300px]"/>
              {/* Display profile picture */}
              {!user?.profilePicURL && (
                <div className=" bg-white text-black h-[150px] w-[150px] rounded-full flex justify-center items-center font-semibold">
                  no photo, still
                </div>
              )}
              {profilePicURL && (
                <div
                  className="w-[150px] h-[150px] rounded-full"
                  style={{
                    backgroundImage: `url(${profilePicURL})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}></div>
              )}

              <div className="userInfoBlock ml-6">
                <p className="my-3 font-semibold">Name: {user.name ? user.name : "Unknown"}</p>
                {user?.age && (
                  <p className="my-3 font-semibold">Age: {user.age}</p>
                )}
                {user?.gender && (
                  <p className="my-3 font-semibold">Gender: {user.gender}</p>
                )}
                <p className="my-3 font-semibold">Language: {user?.language}</p>

                <div className="language-level-display flex">
                  {[1, 2, 3, 4, 5, 6].map((level) => (
                    <div
                      key={level}
                      className={`w-[40px] h-[40px] mx-1 rounded-full flex justify-center items-center ${
                        languageLevel >= level
                          ? "bg-customPink text-white"
                          : "bg-gray-200 text-white"
                      }`}>
                      {level}
                    </div>
                  ))}
                </div>

                {user && (
                  <div className="progress my-3">
                    <p>Progress: {userProgress}%</p>
                    <div className="bg-customGrey relative rounded-xl w-[300px] h-[10px]">
                      <div
                        className="bg-customPink rounded-xl h-[10px] absolute top-0 left-0"
                        style={{ width: `${userProgress}%` }}></div>
                    </div>
                  </div>
                )}

                <p className="my-3 font-semibold">Email: {activeUser}</p>

                <div className="follows flex justify-center bg-white text-customBlack rounded-xl">
                  <Link to="/friends" className="cursor-pointer">
                    Followers:{" "}
                    {user?.followersList ? user.followersList.length : 0}
                  </Link>
                  <Link to="/friends" className="cursor-pointer ml-5">
                    Following:{" "}
                    {user?.followingList ? user.followingList.length : 0}
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
