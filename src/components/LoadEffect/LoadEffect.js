import React from "react";
import ClipLoader from "react-spinners/ClipLoader";
import "../../css/payper-style.css";

const LoadEffect = () => {
  return (
    <div className="loader-container">
      <ClipLoader size="60px" />
    </div>
  );
};

export default LoadEffect;
