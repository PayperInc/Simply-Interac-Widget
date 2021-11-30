import { useContext } from "react";
import interacLogo from "./assets/images/etransfer.png";
import { WidgetContext } from "./WidgetContext";

export const paymentTypes = [
  {
    imageSrc: interacLogo,
    name: "Interac e-Transfer",
    id: "etransfer",
    shortName: "standard",
  },
  { 
    imageSrc: interacLogo, 
    name: "Interac Online", 
    id: "interac",
    shortName: "interac",
  },
  {
    imageSrc: interacLogo,
    name: "Interac Request e-Transfer",
    id: "etransfer",
    shortName: "request",
  },
];

//filter the payment type according to what the banks' availability is
export const paymentFilter = (sid_info,bankId) => {
  const { state } = useContext(WidgetContext);
  const bankData = state.banks.find(x => x.id === bankId)

  let filter = [];
  sid_info.forEach((sid) => {
    //There is an sid for basic/standard accounts and an enhanced. A merchant can have one or both
    if (sid.type === "enhanced"){
      if (bankData.request === "YES"){
        filter.push("request");
      }
      if (bankData.interacOnline === "YES") {
        filter.push("interac");
      }
    }
    else if (sid.type === "standard" && !filter.includes("request")) {
      //We are only ever going to show one e-transfer option - request first, then normal etransfer 
      filter.push("standard");
    }
  });
  return filter;
}

export const filteredPaymentTypesObject = (paymentTypeId) => {
  let paymentTypeObject = paymentTypes.filter(
    (paymentType) => paymentType.shortName == paymentTypeId
  );
  return paymentTypeObject[0];
};

//unused
export const renderPaymentImage = (paymentType) => {
  if (paymentType === "etransfer" || paymentType === "interac") {
    return interacLogo;
  }
};

//unused
export const renderBankImage = (bankId) => {
  const { state } = useContext(WidgetContext);
  let selectedBankSrc;
  state.banks.forEach((bank) => {
    if (bank.id === bankId) {
      selectedBankSrc = bank.src;
    }
  });
  return selectedBankSrc;
};

export const filteredBankObject = (bankId) => {
  const { state } = useContext(WidgetContext);
  let selectedBankObject = state.banks.filter((bank) => bank.id === bankId);
  return selectedBankObject[0];
};

// test for use and delete if unused
export const getTotalCartAmount = (cartArray) => {
  if (cartArray.length === 1) {
    return cartArray[0].unit_price * cartArray[0].quantity;
  }
  let totalSum = 0;
  cartArray.forEach((cartItem) => {
    totalSum += Number(cartItem.unit_price) * Number(cartItem.quantity);
  });

  return totalSum.toFixed(2).toString();
};

export const validateData = (data) => {
  let isValid = true;
  if (validateEmail(data.customerEmail) &&
      validateQuantity(data.items)) {
    isValid = false;
  }
  return isValid;
}


export const validateEmail = (email) => {
  // eslint-disable-next-line no-useless-escape
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const validateCart = (items) => {
  let isValid = true;
  items.map((function (item){ 
    if (item.quantity < 1 || isNaN(item.quantity) || item.unit_price <= 0 || isNaN(item.unit_price)){
      isValid = false;
    }
  }));
  return isValid;
}
