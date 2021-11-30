import React from "react";
import { STATUS_CONSTANTS } from "./constants/status_constants.js";
export const WidgetContext = React.createContext();

const initialState = {
  widgetOpen: false,
  loggedIn: false,
  paymentType: null,
  status: STATUS_CONSTANTS.IDLE, // selecting payment or finalizing payment
  transactionData: {
    customerEmail: null,
    transactionAmount: null,
    transactionCurrency: null,
    sid: null,
  },
  ipData: null,
  userDataFromDb: null, //if user is new, this will be false.
  bankSearchResults: [],
  bankSelection: null,
  nextBankResults: null,
  preferredData: null,
  responseData: null,
  redirectForm: null,
  sid: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "initiate-checkout": {
      //this is triggered on the payment button
      return {
        ...state,
        widgetOpen: true,
        transactionData: action.transactionData,
        ipData: action.ipData,
        status: STATUS_CONSTANTS.SELECTING_PAYMENT,
      };
    }
    case "set-user-data-from-db": {
      return {
        ...state,
        userDataFromDb: action.userDataFromDb,
      };
    }
    case "search-for-bank": {
      return {
        ...state,
        bankSearchResults: action.bankSearchResults,
      };
    }
    case "select-bank": {
      return {
        ...state,
        bankSearchResults: action.bankSearchResults,
        bankSelection: action.bankSelection,
        status: STATUS_CONSTANTS.SELECTING_PAYMENT,
      };
    }
    case "set-payment-filter" : {
      return {
        ...state,
        paymentFilter: action.paymentFilter,
      };
    }
    case "select-payment-type": {
      return {
        ...state,
        paymentType: action.paymentType,
      };
    }
    case "set-preferred-data": {
      return {
        ...state,
        preferredData: action.preferredData,
      };
    }
    case "set-payment-id": {
      return {
        ...state,
        paymentId: action.paymentId,
      };
    }
    case "set-payment-sid": {
      return {
        ...state,
        sid: action.sid,
      };
    }
    case "make-payment-request": {
      return {
        ...state,
        status: STATUS_CONSTANTS.MAKING_PAYMENT_REQUEST,
      };
    }
    case "finalize-payment": {
      return {
        ...state,
        status: STATUS_CONSTANTS.FINALIZING_PAYMENT,
        responseData: action.responseData,
        transactionTime: new Date(),
      };
    }
    case "redirect-payment": {
      return {
        ...state,
        status: STATUS_CONSTANTS.REDIRECT,
        responseData: action.responseData,
      };
    }
    case "declined": {
      return {
        ...state,
        status: STATUS_CONSTANTS.DECLINED,
        responseData: action.responseData,
      };
    }
    case "redirect-data": {
      return {
        ...state,
        redirectForm: action.redirectForm,
      }
    }
    case "close-widget": {
      return {
        initialState,
      };
    }

    default:
      throw new Error(`unrecognized action: ${action.type}`);
  }
}

export const WidgetProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const initiateCheckout = (transactionData, ipData) => {
    dispatch({
      type: "initiate-checkout",
      transactionData,
      ipData,
    });
  };

  const selectPaymentType = (paymentType) => {
    dispatch({
      type: "select-payment-type",
      paymentType,
    });
  };

  const setPaymentFilter = (paymentFilter) => {
    dispatch({
      type: "set-payment-filter",
      paymentFilter,
    });
  };

  const setUserDataFromDb = (userDataFromDb) => {
    dispatch({
      type: "set-user-data-from-db",
      userDataFromDb,
    });
  };

  const searchForBank = (bankSearchResults) => {
    dispatch({
      type: "search-for-bank",
      bankSearchResults,
    });
  };

  const selectBank = (bankSelection) => {
    dispatch({
      type: "select-bank",
      bankSelection,
    });
  };

  const closeWidget = () => {
    dispatch({
      type: "close-widget",
    });
  };

  const makePaymentRequest = () => {
    dispatch({
      type: "make-payment-request",
    });
  };

  const returnDeclined = (responseData) => {
    dispatch({
      type: "declined",
      responseData,
    });
  };

  const finalizePayment = (responseData) => {
    dispatch({
      type: "finalize-payment",
      responseData,
    });
  };

  const redirectPayment = (responseData) => {
    dispatch({
      type: "redirect-payment",
      responseData,
    });
  };

  const redirectFormAction = (redirectForm) => {
    dispatch({
      type: "redirect-data",
      redirectForm,
    });
  };

  const setPreferredData = (preferredData) => {
    dispatch({
      type: "set-preferred-data",
      preferredData,
    });
  };

  const setPaymentId = (paymentId) => {
    dispatch({
      type: "set-payment-id",
      paymentId,
    });
  };

  return (
    <WidgetContext.Provider
      value={{
        state,
        actions: {
          selectPaymentType,
          initiateCheckout,
          setPaymentFilter,
          setPaymentId,
          setUserDataFromDb,
          closeWidget,
          searchForBank,
          selectBank,
          setPreferredData,
          finalizePayment,
          redirectPayment,
          makePaymentRequest,
          redirectFormAction,
          returnDeclined,
        },
      }}
    >
      {children}
    </WidgetContext.Provider>
  );
};
