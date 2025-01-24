import React from "react";
import "../styles/Pending.scss";

const Pending = () => {
  return (
    <div className="loader absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-customGreen text-lg z-10"></div>
  );
};

export default Pending;
