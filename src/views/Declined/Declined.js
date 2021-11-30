import React, { useContext } from "react";
import { WidgetContext } from "../../WidgetContext";
import { selectTransactionMessage, selectTransactionStatus } from "../../selectors";
import "../../css/payper-style.css";
import { STATUS_CONSTANTS } from "../../constants/status_constants";


const Declined = () => {

  const {
      state,
      actions: { closeWidget },
    } = useContext(WidgetContext);
    
  const transactionMessage = selectTransactionMessage(state); 
  const status = selectTransactionStatus(state);
  
  if (status === STATUS_CONSTANTS.DECLINED) {
    return ( 
      <div className="declined-container">
          <div className="error-message" dangerouslySetInnerHTML={{__html: transactionMessage}} />
          <a onClick={() => closeWidget()}>Exit</a>
      </div>
    )}
  else{
    return (  
      <div>
        <h2>Something went wrong</h2>
        <p>we will do something about it</p>
        <a onClick={() => closeWidget()}>Exit</a>
      </div>
    );
  }};

export default Declined;
