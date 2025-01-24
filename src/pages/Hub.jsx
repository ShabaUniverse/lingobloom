import React, { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase-config";
import Pending from "../components/Pending";

// icons
import bookIcon from "../assets/icons/bookIcon.svg";
import podcastIcon from "../assets/icons/podcastIcon.svg";
import vocabularyIcon from "../assets/icons/vocabularyIcon.svg";
import { Link } from "react-router-dom";

import blob1 from "../assets/blobs/blob1.svg";
import blob2 from "../assets/blobs/blob2.svg";
import blob3 from "../assets/blobs/blob3.svg";
import learningGyalSVG from "../assets/illustrations/learningGyalSVG.svg"

const Hub = ({ activeUID }) => {
  const [isPending, setIsPending] = useState(false);
  const [user, setUser] = useState(null);
  const [userProgress, setUserProgress] = useState(0);
  const [quote, setQuote] = useState(null);

  // Массив с цитатами
  const quotes = [
    {
      text: "To have another language is to possess a second soul.",
      author: "Charlemagne",
    },
    {
      text: "One language sets you in a corridor for life. Two languages open every door along the way.",
      author: "Frank Smith",
    },
    {
      text: "A different language is a different vision of life.",
      author: "Federico Fellini",
    },
    {
      text: "Those who know nothing of foreign languages know nothing of their own.",
      author: "Johann Wolfgang von Goethe",
    },
    { text: "Language shapes the way we think.", author: "Benjamin Lee Whorf" },
    {
      text: "Change your language and you change your thoughts.",
      author: "Karl Albrecht",
    },
  ];

  // Выбираем случайную цитату при рендере компонента
  useEffect(() => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);
  }, []);

  // Получение данных пользователя из Firestore
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
            setUserProgress(userData.progress);
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

  // progress change

  const progressChange = async () => {
    const docRef = doc(db, "users", activeUID);
    await updateDoc(docRef, { progress: user.progress + 1 });
  };

  return (
    <div className="hub relative">
      {isPending && <Pending />}
      <div className="hub-container w-[1200px] mx-auto">
        <div className="hub-wrapper flex flex-col justify-center items-center">
          <div className="hub-quote py-5">
            {/* Выводим случайную цитату */}
            {quote && (
              <div className=" flex flex-col items-center">
                <p className="text-3xl">"{quote.text}"</p>
                <p className="text-lg mt-2">- {quote.author}</p>
              </div>
            )}
          </div>

          <img src={blob1} alt="" className=" absolute left-[0px] -z-50 w-[400px]"/>
          <img src={blob2} alt="" className=" absolute left-[0px] top-[300px] -z-50 w-[200px]"/>
          <img src={blob3} alt="" className=" absolute left-[300px] top-[0px] -z-50 w-[200px]"/>
          <img src={learningGyalSVG} alt="" className=" absolute right-[80px] top-[100px] -z-50 w-[300px]"/>

          <div className="hub-profile py-10">
            {user && <p className="text-xl">{user.name || "Your"}'s Hub</p>}
          </div>

          <div className="hub-outer-links flex">
            <Link
              onClick={() => progressChange()}
              to="https://openlibrary.org/"
              target="_blank"
              className="block-books h-[150px] w-[150px] bg-customGreen hover:bg-customPink cursor-pointer flex flex-col justify-center items-center rounded-xl">
              <img src={bookIcon} className=" w-[100px]" alt="Books Icon" />
              <p className="text-white">Books</p>
            </Link>

            <Link
              onClick={() => progressChange()}
              to="https://www.listennotes.com/"
              target="_blank"
              className="block-podcasts h-[150px] w-[150px] ml-5 bg-customGreen hover:bg-customPink cursor-pointer flex flex-col justify-center items-center rounded-xl">
              <img
                src={podcastIcon}
                className=" w-[100px]"
                alt="Podcasts Icon"
              />
              <p className="text-white">Podcasts</p>
            </Link>

            <Link
              onClick={() => progressChange()}
              to="https://www.collinsdictionary.com/"
              target="_blank"
              className="block-vocabulary h-[150px] w-[150px] ml-5 bg-customGreen hover:bg-customPink cursor-pointer flex flex-col justify-center items-center rounded-xl">
              <img
                src={vocabularyIcon}
                className=" w-[100px]"
                alt="Vocabulary Icon"
              />
              <p className="text-white">Vocabulary</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hub;
