import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebase-config";
import { Link } from "react-router-dom";
import Pending from "../components/Pending";

import magnitSVG from "../assets/illustrations/magnitSVG.svg"
import gyalAcceptingSVG from "../assets/illustrations/gyalAcceptingSVG.svg"

const Friends = ({ activeUID }) => {
  const [followers, setFollowers] = useState([]);
  const [followings, setFollowings] = useState([]);

  const [finalFollowersList, setfinalFollowersList] = useState([]);
  const [finalFollowingList, setfinalFollowingList] = useState([]);

  const [pending, setPending] = useState(false);


  useEffect(() => {
    const getUser = async () => {
      setPending(true);
      try {
        const docRef = doc(db, "users", localStorage.activeUID);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setFollowers(userData.followersList);
          setFollowings(userData.followingList);
        }
        setPending(false);
      } catch (error) {
        console.log(error.message);
        setPending(false);
      }
    };

    getUser();
  }, []); // Запускается один раз при монтировании

  //   get followers

  useEffect(() => {
    const getFollowersData = async (followers) => {
      const arrayToAdd = [];
      setPending(true);
      try {
        const promises = followers.map(async (followerId) => {
          const docRef = doc(db, "users", followerId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const thatUserData = docSnap.data();
            arrayToAdd.push({
              name: thatUserData.name,
              id: thatUserData.uid,
              image: thatUserData.profilePicURL,
            });
          }
        });
        await Promise.all(promises);
        setfinalFollowersList(arrayToAdd);
        setPending(false);
      } catch (error) {
        console.log(error.message);
        setPending(false);
      }
    };

    if (followers.length > 0) {
      getFollowersData(followers);
    }
  }, [followers]);

  //   get followings

  useEffect(() => {
    const getFollowingData = async (followings) => {
      const arrayToAdd = [];
      setPending(true);
      try {
        const promises = followings.map(async (followerId) => {
          const docRef = doc(db, "users", followerId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const thatUserData = docSnap.data();
            arrayToAdd.push({
              name: thatUserData.name,
              id: thatUserData.uid,
              image: thatUserData.profilePicURL,
            });
          }
        });
        await Promise.all(promises);
        setfinalFollowingList(arrayToAdd);
        setPending(false);
      } catch (error) {
        setPending(false);
        console.log(error.message);
      }
    };

    if (followings.length > 0) {
      getFollowingData(followings);
    }
  }, [followings]);

  return (
    <div className=" friends h-[88vh] overflow-x-hidden">
      <div className="friends-wrapper h-full">
        <div className="friends-container relative flex justify-center items-center h-full max-w-[1200px] mx-auto">
          <img src={magnitSVG} alt="" className=" absolute top-[100px] right-[-100px] w-[400px]"/>
          <img src={gyalAcceptingSVG} alt="" className=" absolute top-[100px] left-[0px] w-[300px]"/>
          {pending && <Pending />}
          {finalFollowersList && (
            <div className=" h-[90%] py-2 overflow-y-scroll messages rounded-xl w-[300px] bg-customGreen mx-2 relative flex flex-col items-center">
              <p>Followers</p>
              {finalFollowersList.map((item, index) => (
                <Link
                  to={`/community/profile/${item.id}`}
                  className=" flex items-center my-2 bg-white w-[90%] rounded-lg p-1">
                  <div
                    style={{
                      backgroundImage: `url(${item.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                    alt=""
                    className=" w-[50px] h-[50px] rounded-full"
                  />
                  <p className=" ml-10 text-customBlack">{item.name ? item.name : "Unknown"}</p>
                </Link>
              ))}
            </div>
          )}

          {finalFollowingList && (
            <div className=" h-[90%] py-2 overflow-y-scroll messages rounded-xl w-[300px] bg-customGreen mx-2 relative flex flex-col items-center">
              <p>Followings</p>
              {finalFollowingList.map((item, index) => (
                <Link
                  to={`/community/profile/${item.id}`}
                  className=" flex items-center my-2 bg-white w-[90%] rounded-lg p-1">
                  <div
                    style={{
                      backgroundImage: `url(${item.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                    alt=""
                    className=" w-[50px] h-[50px] rounded-full"
                  />
                  <p className=" ml-10 text-customBlack">{item.name ? item.name : "Unknown"}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Friends;
