import React, { useContext } from "react";
import { WidgetContext } from "../../WidgetContext";
import BankList from "../../components/BankList";
import { selectBankSelection, selectTransactionStatus } from "../../selectors";
import PaymentMethods from "../../components/PaymentMethods";
import { STATUS_CONSTANTS } from "../../constants/status_constants.js";
import "../../css/payper-style.css";

const ModalBodyNewUser = () => {
  const { state } = useContext(WidgetContext);

  const transactionStatus = selectTransactionStatus(state);

  return (
    <>
      {transactionStatus === STATUS_CONSTANTS.SELECTING_PAYMENT && (
        <div className="ModalBodyContainer">
          {selectBankSelection(state) ? <PaymentMethods /> : <BankList />}
        </div>
      )}
    </>
  );
};

export default ModalBodyNewUser;
