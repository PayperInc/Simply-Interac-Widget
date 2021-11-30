import { createSelector } from "reselect";

const getBankSelection = (state) => {
  return state.bankSelection;
};

export const selectBankSelection = createSelector(
  getBankSelection,
  (getBankSelection) => {
    return getBankSelection;
  }
);

// ************ //

const getSidInfo = (state) => {
  return state.transactionData.sid_info;
}

export const selectSidInfo = createSelector (
  getSidInfo,
  (getSidInfo) => {
    return getSidInfo;
  }
);

// ************ //

const getPreferredSelection = (state) => {
  return state.preferredData;
};

export const selectPreferredUserData = createSelector(
  getPreferredSelection,
  (getPreferredSelection) => {
    return getPreferredSelection;
  }
);

// ************ //

const getBankSearchResults = (state) => {
  return state.bankSearchResults;
};

export const selectBankSearchResults = createSelector(
  getBankSearchResults,
  (getBankSearchResults) => {
    return getBankSearchResults;
  }
);

// ************ //

const getTransactionStatus = (state) => {
  return state.status;
};

export const selectTransactionStatus = createSelector(
  getTransactionStatus,
  (getTransactionStatus) => {
    return getTransactionStatus;
  }
);

// ************ //

const getResponseData = (state) => {
  return state.responseData;
}

export const selectResponseData = createSelector(
  getResponseData,
  (getResponseData) => {
    return getResponseData;
  }
)

// ************ //

const getETransferDesc = (state) => {
  return state.responseData.descriptor;
}

export const selectEtransferDesc = createSelector(
  getETransferDesc,
  (getETransferDesc) => {
    return getETransferDesc;
  }
)

// ************ //

const getRedirectFields = (state) => {
  return state.responseData.redirect_fields;
}

export const selectRedirectFields = createSelector(
  getRedirectFields,
  (getRedirectFields) => {
    return getRedirectFields;
  }
)

// ************ //

const getRedirectURL = (state) => {
  return state.responseData.redirect_url;
}

export const selectRedirectURL = createSelector(
  getRedirectURL,
  (getRedirectURL) => {
    return getRedirectURL;
  }
)

// ************ //

const getTransactionMessage = (state) => {
  return state.responseData.message;
}

export const selectTransactionMessage = createSelector(
  getTransactionMessage,
  (getTransactionMessage) => {
    return getTransactionMessage;
  }
)

const getPaymentURL = (state) => {
  return state.responseData.payment_url;
}

export const selectPaymentURL = createSelector(
  getPaymentURL,
  (getPaymentURL) => {
    return getPaymentURL;
  }
)


// ************ //

const getTransactionData = (state) => {
  return state.transactionData;
};

export const selectTransactionData = createSelector(
  getTransactionData,
  (getTransactionData) => {
    return getTransactionData;
  }
);

// ************ //

const getRedirectForm = (state) => {
  return (decodeURIComponent(state.responseData.redirect_html)).replace(/\+/g, " ");
};

export const selectRedirectForm = createSelector(
  getRedirectForm,
  (getRedirectForm) => {
    return getRedirectForm;
  }
);

// ************ // Not being used

const getUserDataFromDb = (state) => {
  return state.userDataFromDb;
};

export const selectUserDataFromDb = createSelector(
  getUserDataFromDb,
  (getUserDataFromDb) => {
    return getUserDataFromDb;
  }
);

// ****** selector for making payment request

const getIpData = (state) => {
  return state.ipData;
};

const selectIpData = createSelector(getIpData, (ipData) => ipData);

const getItemsArray = createSelector(
  selectTransactionData,
  (transactionData) => transactionData.items
);

const getShippingAmount = createSelector(
  selectTransactionData,
  (transactionData) => transactionData.amount_shipping
);

const getTransactionTime = (state) => {
  return state.transactionTime;
}

const selectTransactionTime = createSelector(
  getTransactionTime,
  (transactionTime) => transactionTime
);

export const getTotalAmount = createSelector(getItemsArray, getShippingAmount,(cartArray,shippingTotal) => {
  let totalSum = 0;
  cartArray.forEach((cartItem) => {
    totalSum += Number(cartItem.unit_price * cartItem.quantity);
  });
  totalSum += Number(shippingTotal);
  return totalSum.toFixed(2).toString();
});

export const convertDate = (dateTime) => {
  dateTime = dateTime.getUTCFullYear() + "-" + ("0" + (dateTime.getUTCMonth() + 1)).slice(-2) + "-" + ("0" + dateTime.getUTCDate()).slice(-2) + " " + ("0" + dateTime.getUTCHours()).slice(-2) + ":" + ("0" + dateTime.getUTCMinutes()).slice(-2) + ":" + ("0" + dateTime.getUTCSeconds()).slice(-2)

  return dateTime;
}

export const getPeriodArray = createSelector(selectTransactionTime,
  (transactionTime) => {
    let to = new Date(transactionTime);
    let from = new Date(transactionTime);

    to.setSeconds(transactionTime.getSeconds() + 3600);
    from.setSeconds(transactionTime.getSeconds() - 60);

    to = convertDate(to);
    from = convertDate(from);

    transactionTime = convertDate(transactionTime);
    return {
      "to":to,
      "from":from,
    };
  });

export const selectDataForPaymentRequest = createSelector(
  selectTransactionData,
  selectIpData,
  getTotalAmount,
  getItemsArray,
  (transactionData, ipData, totalAmount, getItemsArray) => {
    return {
      first_name: transactionData.first_name,
      last_name: transactionData.last_name,
      email: transactionData.customerEmail,
      phone: transactionData.phone,
      address: transactionData.address,
      city: transactionData.city,
      state: transactionData.state,
      country: transactionData.country,
      zip_code: transactionData.zip_code,
      ip_address: ipData,
      // hashKey: transactionData.rcode,
      totalAmount: totalAmount,
      items: getItemsArray,
      amount_shipping: transactionData.amount_shipping,
      udf1:transactionData.udf1,
      udf2:transactionData.udf2,
      udf3:transactionData.udf3,
      udf4:transactionData.udf4,
      udf5:transactionData.udf5,
      udf6:transactionData.udf6,
      return_url: transactionData.return_url,
      notification_url: transactionData.notification_url,
      endpoint: process.env.PAYPER_ENDPOINT,
    };
  }
);

export const selectDataForStatusCheck = createSelector (
  selectResponseData,
  getPeriodArray,
  selectTransactionData,
  (responseData,periodArray,transactionData) => {
    return {
      period: periodArray,
      sid: responseData.sid,
      udf1:responseData.udf1,
      udf2:responseData.udf2,
      udf3:responseData.udf3,
      udf4:responseData.udf4,
      udf5:responseData.udf5,
      udf6:responseData.udf6,
      // hashKey: transactionData.rcode,
    };
  }
);