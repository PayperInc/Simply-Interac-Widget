import React, { useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { WidgetContext } from "../../WidgetContext";
import LoadEffect from "../LoadEffect";
import CheckoutContainer from "../../views/CheckoutContainer";
import GetIPAddress from "../../fetch/getIpAddress";
import ClipLoader from "react-spinners/ClipLoader";
import { getTotalCartAmount, validateEmail } from "../../utils";

export const PaymentButton = ({
  transactionData,
  inputEmail
}) => {
  const [loading, setLoading] = useState(false);

  const {
    actions: { initiateCheckout },
    state,
  } = useContext(WidgetContext);

  const { widgetOpen } = state;

  // Get the IP address from 'api.js'
  const [ipDetails, isLoadingIp, isError] = GetIPAddress();

  const createCharge = (transData) => {
    setLoading(true); //renders the LoadEffect
    // Add total amount to transData
    transData = {
      ...transData,
      totalCartAmount: getTotalCartAmount(transData.items),
    };

    setTimeout(() => {
      initiateCheckout(transData, ipDetails);
      setLoading(false);
    }, 800);
  };

  // Allow button to trigger if user clicks "enter"
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      createCharge(transactionData);
    }
  };

  useEffect(() => {
    if (validateEmail(inputEmail)) {
      window.addEventListener("keydown", handleKeyDown);

      // cleanup this component
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [inputEmail]);

  return (
    <>
      {isLoadingIp ? (
        <>
          <ClipLoader />
          <p aria-label="waiting-on-server">Waiting on server</p>
        </>
      ) : (
        <button
          href="#"
          className="btn btn-primary"
          onClick={() => {
            if (typeof transactionData === "object" && !isError) {
              createCharge(transactionData);
            }
          }}
        >
          Proceed to Payment
        </button>
      )}
      {isError && <p>Network error, try reloading the page.</p>}
      {widgetOpen && <CheckoutContainer />}
      {loading && <LoadEffect />}
    </>
  );
};

//Prop types for the payment button.

PaymentButton.propTypes = {
  transactionData: PropTypes.shape({
    customerEmail: PropTypes.string.isRequired,
    currency: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        unit_price: PropTypes.number.isRequired,
        quantity: PropTypes.number,
      })
    ),
  }).isRequired,
};

export default PaymentButton;
