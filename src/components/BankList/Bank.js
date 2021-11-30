import React from "react";
import { IoIosArrowForward } from "react-icons/io";
import { WidgetContext } from "../../WidgetContext";
import "../../css/payper-style.css";

const Bank = ({ src, shortName, id, bank_id }) => {
  const {
    state,
    actions: { selectBank },
  } = React.useContext(WidgetContext);

  return (
    <div className="StyledBank"
      onClick={() => selectBank(id)}
    >
      <div className="bank-div">
        <img src={src} />
        <p>{shortName}</p>
      </div>

      <IoIosArrowForward />
    </div>
  );
};

export default Bank;
