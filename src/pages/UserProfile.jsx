import { doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../firebase/firebase-config";
import Pending from "../components/Pending";
import { Link } from "react-router-dom";

import "../App.css";

const UserProfile = ({ activeUID }) => {
  const { id } = useParams(); // `id` - это профиль, который просматривается
  const [user, setUser] = useState(null); // Данные пользователя профиля
  const [isPending, setIsPending] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false); // Состояние: активный пользователь подписан на просматриваемый
  const navigate = useNavigate();

  useEffect(() => {
    const getUserData = async () => {
      setIsPending(true);
      try {
        const docRef = doc(db, "users", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          

          // Проверяем, подписан ли активный пользователь на просматриваемого
          setIsFollowed(userData.followersList?.includes(activeUID) || false);
          setUser(userData);
        }
      } catch (error) {
        console.log(error.message);
      } finally {
        setIsPending(false);
      }
    };
    getUserData();
  }, [id, activeUID]);

  const followHandle = async () => {
    if (!user) return;

    const userRef = doc(db, "users", id); // Просматриваемый профиль
    const activeUserRef = doc(db, "users", activeUID); // Документ активного пользователя

    // Получение данных активного пользователя для обновления его followingList
    const activeUserSnap = await getDoc(activeUserRef);
    const activeUserData = activeUserSnap.data();

    // Ensure followingList is always an array
    const followingList = activeUserData.followingList || [];

    // Обновление followers для профиля, который просматривается
    const updatedFollowersList = isFollowed
      ? user.followersList.filter((follower) => follower !== activeUID) // Логика отписки
      : [...user.followersList, activeUID]; // Логика подписки

    const updatedFollowingList = isFollowed
      ? followingList.filter((following) => following !== id) // Логика отписки активного пользователя
      : [...followingList, id]; // Логика подписки активного пользователя

    try {
      // Обновляем список подписчиков (followers) профиля, который просматривается
      await updateDoc(userRef, {
        followersList: updatedFollowersList,
        followers: updatedFollowersList.length, // Обновляем количество подписчиков
      });

      // Обновляем список подписок (following) активного пользователя
      await updateDoc(activeUserRef, {
        followingList: updatedFollowingList,
        following: updatedFollowingList.length, // Обновляем количество подписок
      });

      // Обновляем локальное состояние
      setIsFollowed(!isFollowed);
      setUser((prevUser) => ({
        ...prevUser,
        followersList: updatedFollowersList,
        followers: updatedFollowersList.length,
      }));
    } catch (error) {
      console.log(error.message);
    }
  };

  // Chat Handle -----------------------------------------------------------------------------------

  const createChat = async () => {
    const chatData = {
      chatUsers: [activeUID, id],
      messages: [], // Инициализируем пустой массив для сообщений
    };

    const activeUserRef = doc(db, "users", activeUID);
    const userRef = doc(db, "users", id);

    try {
      const activeUserSnap = await getDoc(activeUserRef);
      const activeUserData = activeUserSnap.data();

      // Проверяем, что `chats` - это массив
      const userChats = Array.isArray(activeUserData.chats)
        ? activeUserData.chats
        : [];

      // Проверяем наличие чата с теми же пользователями
      const existingChat = userChats.find(
        (chat) =>
          chat.chatUsers.sort().toString() ===
          chatData.chatUsers.sort().toString()
      );

      if (existingChat) {
        // Если чат найден, перенаправляем на него
        navigate(`/chat/${existingChat.chatID}`);
      } else {
        // Генерация нового chatID
        const newChatID = Math.random().toString().slice(2, 12);
        chatData.chatID = newChatID; // Добавляем chatID к chatData

        const userSnap = await getDoc(userRef);
        const userData = userSnap.data();

        // Проверяем, что `chats` - это массив
        const profileChats = Array.isArray(userData.chats)
          ? userData.chats
          : [];

        // Добавляем новый чат к активному пользователю и пользователю, с которым он общается
        await updateDoc(activeUserRef, {
          chats: [...userChats, chatData], // Убедитесь, что chats это массив
        });

        await updateDoc(userRef, {
          chats: [...profileChats, chatData], // Убедитесь, что chats это массив
        });

        // Перенаправление на новый чат
        navigate(`/chat/${newChatID}`);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="userProfile">
      {isPending && <Pending />}
      <div className="def-container">
        <div className="userProfile-wrapper pt-10">
          {user && (
            <div className="flex  text-customBlack w-[700px] p-10 rounded-xl">
              {!user?.profilePicURL ? (
                    <div className=" bg-customGrey text-black h-[250px] w-[250px] rounded-full flex justify-center items-center font-semibold">
                      no photo, still
                    </div>
                  ) : (
                    <div
                      className=" w-[250px] h-[250px] rounded-full"
                      style={{
                        backgroundImage: `url(${user.profilePicURL})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}></div>
                  )}

              <div className="rightSide ml-10">
                <div>
                  <p className="text-xl my-2">{user.name}</p>
                  <p className="my-2">Drilling {user.language}</p>
                </div>

                <div className="follows flex justify-center px-2 bg-customGrey text-customBlack rounded-xl">
                  <p className="cursor-pointer">
                    Followers: {user.followersList?.length || 0}
                  </p>
                  <p className="cursor-pointer ml-5">
                    Followings: {user.followingList?.length || 0}
                  </p>
                </div>

                {/* Кнопка подписки/отписки */}
                <button
                  className="bg-customGreen mt-5 px-3 py-1 w-[100px] rounded-lg hover:bg-customGrey"
                  onClick={followHandle}>
                  {isFollowed ? "Unfollow" : "Follow"}
                </button>

                {/* Кнопка для чата */}
                <Link
                  onClick={createChat}
                  className="bg-customGreen mt-5 ml-2 px-3 py-1 w-[100px] inline-block text-center rounded-lg hover:bg-customGrey">
                  Chat
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
