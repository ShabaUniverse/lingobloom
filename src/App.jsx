import "./App.css";
import Home from "./pages/Home";
import Header from "./components/Header";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import { Route, Routes, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import Hub from "./pages/Hub";
import Community from "./pages/Community";
import UserProfile from "./pages/UserProfile";
import ChatActive from "./pages/ChatActive";
import Friends from "./pages/Friends";
import VideoCall from "./pages/VideoCall";

function App() {
  // Storage states
  const [activeUser, setActiveUser] = useState("");
  const [activeUID, setActiveUID] = useState("");

  // Setting up LOCAL STORAGE
  useEffect(() => {
    const storedUser = localStorage.getItem("activeUser");
    const storedUID = localStorage.getItem("activeUID");

    if (storedUser) {
      setActiveUser(storedUser);
    }
    if (storedUID) {
      setActiveUID(storedUID);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("activeUser", activeUser);
  }, [activeUser]);

  useEffect(() => {
    localStorage.setItem("activeUID", activeUID);
  }, [activeUID]);

  return (
    <div className="App">
      <Header activeUser={activeUser} />
      <Routes>
        <Route
          path="/"
          element={activeUser ? <Navigate to="/profile" /> : <Home />}
        />
        <Route
          path="/signup"
          element={
            activeUser ? (
              <Navigate to="/profile" />
            ) : (
              <Signup
                setActiveUser={setActiveUser}
                setActiveUID={setActiveUID}
              />
            )
          }
        />
        <Route
          path="/login"
          element={
            activeUser ? (
              <Navigate to="/profile" />
            ) : (
              <Login
                setActiveUser={setActiveUser}
                setActiveUID={setActiveUID}
              />
            )
          }
        />
        <Route
          path="/profile"
          element={
            activeUser ? (
              <Profile
                activeUser={activeUser}
                activeUID={activeUID}
                setActiveUser={setActiveUser}
                setActiveUID={setActiveUID}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/chat/:id"
          element={
            activeUser ? (
              <ChatActive activeUser={activeUser} activeUID={activeUID} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/hub"
          element={
            activeUser ? (
              <Hub activeUID={activeUID} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/community"
          element={
            activeUser ? (
              <Community activeUID={activeUID} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path={`/community/profile/:id`}
          element={
            activeUser ? (
              <UserProfile activeUID={activeUID} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        
        <Route
          path="/friends"
          element={
            activeUser ? (
              <Friends activeUID={activeUID} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </div>
  );
}

export default App;
