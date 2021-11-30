import React, { useContext } from "react";
import PaymentMethod from "./PaymentMethod";
import { paymentTypes,
  paymentFilter
 } from "../../utils";
import { WidgetContext } from "../../WidgetContext";
import { selectBankSelection, selectSidInfo } from "../../selectors";
import RenderBankSelection from "../../components/BankList/RenderBankSelection";
import "../../css/payper-style.css";

const PaymentMethods = () => {
  const {
    state,
    actions: { selectBank },
  } = useContext(WidgetContext);
  const bankSelection = selectBankSelection(state);
  const sid_info = selectSidInfo(state);

  let selectedBank;
  state.banks.forEach((bank) => {
    if (bank.id === bankSelection) {
      selectedBank = bank;
    }
  });
  let filterOptions = paymentFilter(sid_info,bankSelection);

  return (
    <>
      {selectedBank && RenderBankSelection(selectedBank, selectBank)}
      <div className="HeadingContainer">
        <div className="SoftHeading">Select a payment type</div>
      </div>
      <div className="PaymentMethodsContainer">
        {paymentTypes
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
        ))}
      </div>
    </>
  );
};

export default PaymentMethods;
