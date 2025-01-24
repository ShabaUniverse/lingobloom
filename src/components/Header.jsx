import React from "react";
import "../App.css";
import { Link } from "react-router-dom";
import Logo from "../assets/icons/logo.png";

const Header = ({ activeUser }) => {
  return (
    <div className="header h-[12vh] sticky top-0 z-50 bg-white">
      <div className="header-container w-[1200px] mx-auto h-full">
        <div className="header-wrapper flex justify-between items-center h-full">
          <div className="header-logo">
            <Link to="/" className="pgr text-customBlack hover:text-customPink">
              <img src={Logo} className=" w-[120px]" />
            </Link>
          </div>

          <div className="header-links">
            {activeUser && (
              <Link
                to="/profile"
                className=" text-customBlack hover:text-customPink mx-1 border-r pr-3">
                Profile
              </Link>
            )}
            {activeUser && (
              <Link
                to="/hub"
                className=" text-customBlack hover:text-customPink mx-1 border-r pr-3">
                Hub
              </Link>
            )}
            {activeUser && (
              <Link
                to="/community"
                className=" text-customBlack hover:text-customPink mx-1 border-r pr-3">
                Community
              </Link>
            )}

            {activeUser && (
              <Link
                to="/friends"
                className=" text-customBlack hover:text-customPink mx-1">
                Friends
              </Link>
            )}

            

            {!activeUser && (
              <div>
                <Link
                  to="/login"
                  className=" text-white mx-1 px-3 py-1 bg-customGreen rounded-xl hover:bg-customPink hover:text-customGreen">
                  Login
                </Link>
                <Link
                  to="/signup"
                  className=" text-white mx-1 px-3 py-1 bg-customGreen rounded-xl hover:bg-customPink hover:text-customGreen">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
