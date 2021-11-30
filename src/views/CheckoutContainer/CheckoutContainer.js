import React, { useContext } from "react";
import BeatLoader from "react-spinners/BeatLoader";
import { IoIosArrowBack } from "react-icons/io";
import { WidgetContext } from "../../WidgetContext";
import { STATUS_CONSTANTS } from "../../constants/status_constants.js";
import { checkUser } from "../../fetch/checkUser";
import { getBankList } from "../../fetch/getBankList";
import ModalBodyNewUser from "../ModalBodyNewUser";
import ModalBodyReturningUser from "../ModalBodyReturningUser";
import { selectTransactionData,
  selectTransactionStatus, 
  getTotalAmount } from "../../selectors";
import ThankYou from "../../views/FinalizingPayment";
import CompanyLogo from "../../components/CompanyLogo/CompanyLogo";
import Redirect from "../Redirect/Redirect";
import Declined from "../Declined/Declined";
import "../../css/payper-style.css";

const CheckoutContainer = () => {
  const {
    state,
    actions: { closeWidget, setUserDataFromDb, setPreferredData, selectBank },
  } = useContext(WidgetContext);

  const transactionData = selectTransactionData(state);
  const transactionTotal = getTotalAmount(state);
  
  //can I one-line this?
  const banks = getBankList();
  state.banks = banks;
  
  //creates and posts new user only when checkout container (modal) is triggered
  //request body
  const reqBody = {
    ...state.transactionData,
    ipData: { ...state.ipData },
  };
  const {
    dbPostData,
    isLoadingPost,
    hasErrorPost,
    errorMessagePost,
  } = checkUser(reqBody);

  React.useEffect(() => {
    dbPostData && setUserDataFromDb(dbPostData.data);
  }, [dbPostData]);

  React.useEffect(() => {
    dbPostData &&
      dbPostData.preferredData &&
      selectBank(dbPostData.preferredData.preferredBank);
    dbPostData &&
      dbPostData.preferredData &&
      setPreferredData(dbPostData.preferredData);
  }, [dbPostData]);

  const transactionStatus = selectTransactionStatus(state);

  const renderLoadingContainer = (
    <div className="loading-spinner-container">
      <BeatLoader color="#5E79DC" />
    </div>
  );

  const renderWidgetFlow = () => {
    switch(transactionStatus){
      case STATUS_CONSTANTS.MAKING_PAYMENT_REQUEST:
        return renderLoadingContainer;
      case STATUS_CONSTANTS.FINALIZING_PAYMENT:
        return <ThankYou />;
      case STATUS_CONSTANTS.REDIRECT:
        return <Redirect />;
      case STATUS_CONSTANTS.DECLINED:
        return <Declined />;
      case STATUS_CONSTANTS.ERROR:
        return <Declined/>;
    }
    if (isLoadingPost) {
      return renderLoadingContainer;
    } 
    else if (hasErrorPost) {
      return <p>{errorMessagePost}</p>;
    } 
    else if (dbPostData) {
      if (dbPostData.preferredData) {
        return <ModalBodyReturningUser />;
      } 
      else return <ModalBodyNewUser />;
    } 
    else return <p>there was an error</p>;
  };

  return (
    <>
      <div className="ModalBackdrop" />
      <div className="ModalContainer">
        <div className="StyledModal">
          <div className="ModalHeader">
            {state.widgetOpen && (
              <div className="ExitContainer"
                onClick={() => closeWidget()}>
                <div className="ModalExit">
                  <IoIosArrowBack/>
                </div>
                <p>back</p>
              </div>
            )}
            <CompanyLogo />
            <div className="ModalTitle">
              <p>{transactionData.first_name} {transactionData.last_name}'s {transactionData.company_name} checkout</p>
              <h3>
                {transactionData.currency} ${transactionTotal} 
              </h3>
            </div>
          </div>
          {renderWidgetFlow()}
        </div>
      </div>
    </>
  );
};

export default CheckoutContainer;
