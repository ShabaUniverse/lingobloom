import { doc, getDoc, updateDoc, onSnapshot } from "firebase/firestore";
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { db } from "../firebase/firebase-config";

import chattingSVG from "../assets/illustrations/chattingSVG.svg"

import "../App.css";

function ChatActive({ activeUser, activeUID }) {
  const { id } = useParams();
  const [secondUserUID, setSecondUserUID] = useState("");
  const [secondUserName, setSecondUserName] = useState("");
  const [secondUserProfilePicURL, setSecondUserProfilePicURL] = useState("");
  const [messageText, setMessageText] = useState("");
  const [primeName, setPrimeName] = useState("");
  const [messages, setMessages] = useState([]);
  const [existingChats, setExistingChats] = useState([]);
  const messagesContainerRef = useRef(null);

  // Прокрутка вниз при обновлении сообщений -------------------------------------------------------
  useEffect(() => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  // функция отправки сообщения

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!messageText || !secondUserUID) return;

    const message = {
      text: messageText,
      author: primeName,
      time: new Date().toISOString(),
    };

    try {
      const userDocRef1 = doc(db, "users", activeUID);
      const userDocRef2 = doc(db, "users", secondUserUID);

      const docSnap1 = await getDoc(userDocRef1);
      const docSnap2 = await getDoc(userDocRef2);

      if (docSnap1.exists() && docSnap2.exists()) {
        let user1Data = docSnap1.data();
        let user2Data = docSnap2.data();

        const chatOfFirstUser = user1Data.chats.find(
          (chat) => chat.chatID === id,
        );
        const chatOfSecondUser = user2Data.chats.find(
          (chat) => chat.chatID === id,
        );

        if (chatOfFirstUser && chatOfSecondUser) {
          chatOfFirstUser.messages = [...chatOfFirstUser.messages, message];
          chatOfSecondUser.messages = [...chatOfSecondUser.messages, message];

          await updateDoc(userDocRef1, {
            chats: user1Data.chats,
          });

          await updateDoc(userDocRef2, {
            chats: user2Data.chats,
          });

          setMessageText("");
        } else {
          console.log("Chat not found in one of the users!");
        }
      } else {
        console.log("One of the user documents does not exist!");
      }
    } catch (error) {
      console.error("Error updating messages: ", error);
    }
  };

  // Подписка на изменения сообщений --------------------------------------------------------------
  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "users", activeUID), (docSnap) => {
      if (docSnap.exists()) {
        const snapshot = docSnap.data();
        const chat = snapshot.chats.find((chat) => chat.chatID === id);
        if (chat) {
          setMessages(chat.messages);
        }
      } else {
        console.log("Document does not exist!");
      }
    });

    return () => unsubscribe();
  }, [messageText, id]);

  // Получение пользователей чата -------------------------------------------------------------------
  useEffect(() => {
    const getAllChatUsers = async () => {
      // сперва получаем с какими пользователями есть чаты у активного юзера;
      const docRef = doc(db, "users", activeUID);
      const docSnap = await getDoc(docRef);
      const snapshot = docSnap.data();
      const activeChats = snapshot.chats;
      let chatUserIDS = [];
      for (let i = 0; i < activeChats.length; i++) {
        let getUserID = activeChats[i].chatUsers
          .filter((item) => item !== activeUID)
          .toString();
        // получить фото пользователей;
        const secRef = doc(db, "users", getUserID);
        const secSnap = await getDoc(secRef);
        const secSnapshot = secSnap.data();
        const userImage = secSnapshot.profilePicURL;
        const userName = secSnapshot.name;
        chatUserIDS.push({
          userID: getUserID,
          chatID: activeChats[i].chatID,
          userImage: userImage,
          userName: userName,
        });
      }

      console.log(chatUserIDS);
      setExistingChats(chatUserIDS);
    };

    getAllChatUsers();
  }, []);

  // Получение данных второго пользователя ---------------------------------------------------------------------
  useEffect(() => {
    const getUserData = async () => {
      try {
        const docRef = doc(db, "users", activeUID);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const snapshot = docSnap.data();
          const exactChat = snapshot.chats.find((chat) => chat.chatID === id);
          setPrimeName(snapshot.name);
          if (exactChat) {
            const thatUser = exactChat.chatUsers.filter(
              (user) => user !== activeUID,
            );
            setSecondUserUID(thatUser[0]);
          } else {
            console.log("Chat not found");
          }
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
    };

    getUserData();
  }, [id, activeUID]);

  // получаем фото и имя второго пользователя:
  useEffect(() => {
    const getSecondUserPhotoAndName = async () => {
      try {
        const docRef = doc(db, "users", secondUserUID);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const snap = docSnap.data();
          console.log("this snap", snap);
          setSecondUserName(snap.name);
          setSecondUserProfilePicURL(snap.profilePicURL);
        } else {
          console.log("snapshot doesnt exist");
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (secondUserUID.length > 0) {
      getSecondUserPhotoAndName();
    }
  }, [secondUserUID]);

  // для звонка

  const handleCall = () => {
    const meetLink = `https://meet.google.com/new`; // Генерируем ссылку на новую встречу
    window.open(meetLink, "_blank"); // Открываем ссылку в новой вкладке
  };

  // Skeleton ------------------------------------------------------------------------------

  return (
    <div className="chat h-[88vh]">
      <div className="chat-container max-w-[1200px] mx-auto h-full">
        <div className="chat-wrapper  flex flex-col justify-center items-center h-full">
          <div
            className="secondUserDisplay border border-customBlack flex justify-center bg-customBlack chat-top w-[800px] py-2"
            style={{
              borderTopLeftRadius: "20px",
              borderTopRightRadius: "20px",
            }}>
            {secondUserUID && (
              <div className=" flex items-center">
                <div
                  className=" w-[50px] h-[50px] rounded-full"
                  style={{
                    backgroundImage: `url(${secondUserProfilePicURL})`,
                    backgroundSize: "cover",
                  }}></div>
                <p className=" ml-5 font-semibold text-white">{secondUserName}</p>
                <button
                  onClick={handleCall}
                  className=" bg-red-400 ml-10 px-3 py-1 w-[100px] rounded-lg hover:bg-customGrey text-white"
                >
                  Call
                </button>
              </div>
            )}
          </div>

          <div className="chat-bottom w-[800px] flex h-[70%] border-[2px] border-customBlack">
            <div
              className="chatUsers bg-white w-[300px]"
              style={{
                borderBottomLeftRadius: "20px",
              }}>
              {existingChats.map((item) => (
                <Link
                  to={`/chat/${item.chatID}`}
                  className=" flex items-center my-3 p-1 rounded-xl bg-customBlack w-[80%] mx-auto">
                  <div
                    style={{
                      backgroundImage: `url(${item.userImage})`,
                      backgroundSize: "cover",
                    }}
                    className="w-[40px] h-[40px] rounded-full"></div>
                  <p className=" ml-3 text-white">{item.userName ? item.userName : "Unknown"}</p>
                </Link>
              ))}
            </div>

            <div
              className="chatMessagesContainer w-[500px] bg-white p-2 border-l border-gray-300"
              style={{
                borderBottomRightRadius: "20px",
              }}>
              <div
                className="messages h-[90%] overflow-auto flex flex-col"
                ref={messagesContainerRef}>
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`message ${
                      msg.author === primeName
                        ? "self-end bg-customGreen my-2 w-[200px] p-2 rounded-lg text-customBlack "
                        : "self-start bg-customGreen my-2 w-[200px] p-2 rounded-lg text-customBlack "
                    }`}>
                    <p className=" nunito-font">{msg.text}</p>
                  </div>
                ))}
              </div>

              <form
                className="sendMessage flex justify-center items-center"
                onSubmit={sendMessage}>
                <input
                  style={{
                    borderTopLeftRadius: "20px",
                    borderBottomLeftRadius: "20px",
                  }}
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type your message..."
                  className="border w-[80%] p-2 outline-none"
                />
                <button
                  type="submit" 
                  style={{
                    borderTopRightRadius: "20px",
                    borderBottomRightRadius: "20px",
                  }}
                  className="bg-customBlack text-white p-2">
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatActive;
