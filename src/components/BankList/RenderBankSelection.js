import React from "react";
import "../../css/payper-style.css";

const RenderBankSelection = (selectedBank, action) => {
  return (
    <div className="StyledBankImageContainer">
      <div>
        <img className="StyledBankImage" src={selectedBank.src}/>
      </div>
      <h3 className="BoldTitle">{selectedBank.shortName}</h3>
      <div className="AdjustedEditBtn" onClick={() => action(null)}>
        change bank
      </div>
    </div>
  );
};

export default RenderBankSelection;
