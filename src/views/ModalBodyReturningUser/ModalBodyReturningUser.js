import React, { useState, useContext, useEffect } from "react";
import { selectBankSelection, selectPreferredUserData, selectSidInfo } from "../../selectors";
import { WidgetContext } from "../../WidgetContext";
import PaymentMethod from "../../components/PaymentMethods/PaymentMethod";
import {
  filteredBankObject,
  filteredPaymentTypesObject,
  paymentTypes,
  paymentFilter
} from "../../utils";
import BankList from "../../components/BankList";
import RenderBankSelection from "../../components/BankList/RenderBankSelection";
import "../../css/payper-style.css";

const ModalBodyReturningUser = () => {
  const [renderAllPaymentOptions, setRenderAllPaymentOptions] = useState(false);
  const {
    state,
    actions: { selectBank },
  } = useContext(WidgetContext);

  // SELECTORS
  const preferredData = selectPreferredUserData(state);
  const bankSelection = selectBankSelection(state);
  const sid_info = selectSidInfo(state);  
  let morePayments = true;

  //if a returning user changes banks, we have to be sure to clear the saved preferrence so the wrong payment type doesn't show up in a bank that doesn't support it
  const compareBankSelection = () => {
    if (!(preferredData.preferredBank === bankSelection)){
      setRenderAllPaymentOptions(true);
    }
  }

  useEffect(() => {
    compareBankSelection();
  },[bankSelection])

  const renderPreferredBank = () => {
    let returningUserBankOject = filteredBankObject(bankSelection);

    if (bankSelection) {
      return RenderBankSelection(returningUserBankOject, selectBank);
    }
  };

  const renderPreferredPayment = () => {
    let returningUserPaymentTypeObj = filteredPaymentTypesObject(
      preferredData.preferredPaymentType
    );
    let filterOptions = paymentFilter(sid_info,bankSelection);

    if (filterOptions.length === 1) {
      morePayments = false;
    }

    //get the preferred bank, else list everything, filtering out the payment options according to sid and bank's information
    if (!renderAllPaymentOptions && returningUserPaymentTypeObj) {
      return (
        <PaymentMethod
          paymentId={returningUserPaymentTypeObj.id}
          paymentName={returningUserPaymentTypeObj.name}
          src={returningUserPaymentTypeObj.imageSrc}
          shortName={returningUserPaymentTypeObj.shortName}
        />
      );
    } else
      return paymentTypes
        .filter(function (type){
          return filterOptions.includes(type.shortName);
        })
        .map((type) => (
        <PaymentMethod
          key={type.name}
          paymentId={type.id}
          paymentName={type.name}
          src={type.imageSrc}
          shortName={type.shortName}
        />
      ));
  };

  return (
    <div className="ModalBodyContainer">
      {selectBankSelection(state) ? renderPreferredBank() : <BankList />}

      {selectBankSelection(state) && (
        <>
          <div className="HeadingContainer">
            <div className="SoftHeading">
              {!renderAllPaymentOptions
                ? "preferred payment method"
                : "all payment types"}
            </div>
          </div>
          {renderPreferredPayment()}
          <div className="HeadingContainer">
            {!renderAllPaymentOptions && morePayments && (
              <div className="MakeChangeBtn"
                onClick={() => setRenderAllPaymentOptions(true)}
              >
                + More Payment Methods
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ModalBodyReturningUser;
