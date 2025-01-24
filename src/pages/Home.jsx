import { Link } from "react-router-dom";
import React from "react";

import GirlWorldSVG from "../assets/illustrations/girlWorldSVG.svg";
import nightcallSVG from "../assets/illustrations/nightcallSVG.svg";
import girlGlassSVG from "../assets/illustrations/girlGlassSVG.svg";
import testSVG from "../assets/illustrations/testSVG.svg";

import "../styles/HomeDivider.scss";
import "../App.css";

const Home = () => {
  return (
    <div className="home">
      <div className="home-wrapper">
        {/* first */}
        <div className="first-section h-screen relative">
          <div className="first-section-wrapper">
            <div className="def-container flex justify-between items-center">
              <div className="first-section-desc flex flex-col relative w-[300px] ml-[150px]">
                <h2 className="text-5xl font-bold">
                  Expand Your Language Horizons
                </h2>
                <p className=" text-xl">
                  Start real-time conversations around the world
                </p>
                <Link
                  to="login"
                  className=" bg-customGreen px-4 py-2 text-white rounded-xl w-[150px] flex justify-center items-center hover:bg-customPink hover:text-customGreen">
                  Get Started
                </Link>
              </div>

              <div className="first-section-img w-[500px]">
                <img src={GirlWorldSVG} alt="" className=" relative w-full" />
              </div>
            </div>
          </div>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
            className="absolute bottom-0">
            <path
              fill="#B0D6FC"
              fillOpacity="1"
              d="M0,256L34.3,229.3C68.6,203,137,149,206,133.3C274.3,117,343,139,411,165.3C480,192,549,224,617,240C685.7,256,754,256,823,234.7C891.4,213,960,171,1029,144C1097.1,117,1166,107,1234,117.3C1302.9,128,1371,160,1406,176L1440,192L1440,320L1405.7,320C1371.4,320,1303,320,1234,320C1165.7,320,1097,320,1029,320C960,320,891,320,823,320C754.3,320,686,320,617,320C548.6,320,480,320,411,320C342.9,320,274,320,206,320C137.1,320,69,320,34,320L0,320Z"></path>
          </svg>
        </div>

        {/* second */}

        <div className="second-section relative h-[30vh] bg-customGreen">
          <div className="def-container h-full">
            <div className="wrapper flex justify-between h-full items-center">
              <img
                src={testSVG}
                alt=""
                className=" absolute w-[400px] left-[35%] top-[70px]"
              />

              <h4 className=" ml-[100px] bg-customGreen text-customBlack top text-5xl font-bold">
                The Perks
              </h4>

              <div className="second-section-perks">
                <ul className=" mr-[100px]">
                  <li className=" text-customBlack text-2xl my-3 font-semibold">
                    Real-time Chat
                  </li>
                  <li className=" text-customBlack text-2xl my-3 font-semibold">
                    Videochat
                  </li>
                  <li className=" text-customBlack text-2xl my-3 font-semibold">
                    Customizable Profiles
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* third */}

        <div className="third-section bg-white h-[100vh]">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path
              fill="#B0D6FC"
              fillOpacity="1"
              d="M0,256L26.7,240C53.3,224,107,192,160,160C213.3,128,267,96,320,80C373.3,64,427,64,480,69.3C533.3,75,587,85,640,80C693.3,75,747,53,800,69.3C853.3,85,907,139,960,170.7C1013.3,203,1067,213,1120,192C1173.3,171,1227,117,1280,96C1333.3,75,1387,85,1413,90.7L1440,96L1440,0L1413.3,0C1386.7,0,1333,0,1280,0C1226.7,0,1173,0,1120,0C1066.7,0,1013,0,960,0C906.7,0,853,0,800,0C746.7,0,693,0,640,0C586.7,0,533,0,480,0C426.7,0,373,0,320,0C266.7,0,213,0,160,0C106.7,0,53,0,27,0L0,0Z"></path>
          </svg>
          <div className="def-container">
            <div className="wrapper flex justify-between items-center">
              <div className="third-left ml-[150px] w-[250px]">
                <h4 className=" text-customBlack text-4xl">
                  Connect, Learn, and Speak.
                </h4>
                <p className=" text-customBlack text-lg">
                  Your Gateway to Language Mastery!
                </p>

                <Link className=" bg-customGreen px-4 py-2 text-customBlack rounded-xl w-[150px] flex justify-center items-center hover:bg-customPink hover:text-customGreen">
                  Get Started
                </Link>
              </div>

              <div className="third-right">
                <img src={girlGlassSVG} alt="" className=" w-[400px]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
