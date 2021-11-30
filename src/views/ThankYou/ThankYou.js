import React, { useContext, useState } from "react";
import { WidgetContext } from "../../WidgetContext";
import {
  selectTransactionMessage,
  selectPaymentURL,
  selectEtransferDesc,
  selectDataForStatusCheck,
  convertDate,
  selectDataForPaymentRequest
} from "../../selectors";
import { STATUS_CONSTANTS } from "../../constants/status_constants.js";
import axios from "axios";
import { env } from "../../constants/environment";
import "../../css/payper-style.css";
import Countdown from "react-countdown";
import styled from "styled-components";

const StyledCountDown = styled(Countdown)`
  color: red;
  margin: 0px auto 15px;
  display: table;
`;

const ThankYouFlow = () => {
  const {
    state,
    actions: { closeWidget },
  } = useContext(WidgetContext);
  const [approved, setApproved] = useState(false);
  const transactionMessage = selectTransactionMessage(state);
  const payURL = selectPaymentURL(state);
  const isETransfer = selectEtransferDesc(state);
  let widgetOpen = true;

  const checkTimer = () => {
    if (!approved && isETransfer) {
      //every 20 seconds we will check if the payment has been made, then update the widget once we see a PAYMENT
      const timer = setTimeout(() => checkStatus(), 20000);
      return () => clearTimeout(timer);
    };
  }

  //this is ugly and I will have to see if there's a cleaner way to do this - ahp feb 9, 2021 
  const checkForStatus = (resultSet) => {
    for (const item in resultSet) {
      if (item === "history") {
        for (const subset in resultSet[item]) {
          for (const historySubset in resultSet[item][subset]) {
            if (historySubset === "action" && resultSet[item][subset][historySubset] === "PAYMENT") {
              return true;
            }
          }
        }
      }
    }
    return false;
  };

  const checkStatus = async () => {
    if (widgetOpen) {
      const dataForStatusCheck = selectDataForStatusCheck(state);
      const dataForPaymentRequest = selectDataForPaymentRequest(state);
      const res = await axios.post(`${env}checkStatus/`, dataForPaymentRequest);

      if (res.data.status == "paid") {
        setApproved(true);
      }
      else {
        //We don't need this to run forever, so if the report "to" time has been reached, we're closing this anyway. This will prevent constant hammering of the API (1 hour)
        checkTime(dataForStatusCheck.period.to);
        checkTimer();
      }
    }
  };

  const checkTime = (to) => {
    let now = new Date();
    now = convertDate(now);
    if (Date.parse(now) > Date.parse(to)) {
      closeWidgetAction();
    }
  }

  const closeWidgetAction = () => {
    widgetOpen = false;
    closeWidget();
  }

  if ((isETransfer === STATUS_CONSTANTS.MONEY_REQUEST || isETransfer === STATUS_CONSTANTS.TEST_BALANCER || isETransfer === STATUS_CONSTANTS.TEST || isETransfer === STATUS_CONSTANTS.PRODUCTION || isETransfer === STATUS_CONSTANTS.ETRANSFER) && !approved) {
    window.open(payURL);
    checkTimer();
    return (
      <div>
        <StyledCountDown date={Date.now() + 600000} />
        {/* {payURL} */}
        <div class="pp_message">
          <div class="pp_message_text pp_message_paynow">Please complete the payment in the pop-up window.</div>
          {/* <div class="pp_message_text pp_message_microtext">hello.</div>
          <div class="pp_message_text pp_message_subtext">hello.</div> */}
        </div>
        {/* <div dangerouslySetInnerHTML={{__html: transactionMessage}} /> */}
        <p className="exit-button exit-position-bottom"><a onClick={() => closeWidgetAction()}>exit</a></p>
      </div>
    )
  }
  else if (approved) {
    return (
      <div className="trans-complete">
        <p>Your transaction has been completed.</p>
        <p>Thank you for your business.</p>
        <p className="exit-button exit-position-middle"><a onClick={() => closeWidgetAction()}>done</a></p>
      </div>
    )
  }
  else {
    return (
      <div>
        <h2>Something went wrong</h2>
        <p>Please contact support</p>
        <p className="exit-button exit-position-middle"><a onClick={() => closeWidget()}>exit</a></p>
      </div>
    );
  }
};

export default ThankYouFlow;
