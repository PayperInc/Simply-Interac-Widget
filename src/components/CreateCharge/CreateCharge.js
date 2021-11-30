import React, { useEffect, useContext, useState } from "react";
import { WidgetContext } from "../../WidgetContext";
import CheckoutContainer from "../../views/CheckoutContainer";
import GetIPAddress from "../../fetch/getIpAddress";
import ClipLoader from "react-spinners/ClipLoader";
import { getTotalCartAmount, 
  validateEmail } from "../../utils";
import LoadEffect from "../LoadEffect";

export const CreateCharge = ({
    transactionData
}) => {
    const [loading, setLoading] = useState(false);
  
    const {
      actions: { initiateCheckout },
      state,
    } = useContext(WidgetContext);
  
    const { widgetOpen } = state;
  
    // Get the IP address from 'api.js'
    const [ipData, isLoadingIp, isError] = GetIPAddress();
    state.ipData = ipData;

    if(transactionData && validateEmail(transactionData.customerEmail)){ 

        useEffect(() => {
            setLoading(true),[];
        })

        // Add total amount to transData -- this appears to be not used for anything and is a duplicate function
        transactionData = {
          ...transactionData,
          totalCartAmount: getTotalCartAmount(transactionData.items),
        };

        useEffect(() => {
            const timer = setTimeout(() => initiateCheckout(transactionData, ipData), 3000);
            return () => clearTimeout(timer);
          }, []);
        useEffect(() => {
            setLoading(false),[];
        })
    }

    return (
      <>
        {isLoadingIp ? (
            <>
                <ClipLoader />
                <p aria-label="waiting-on-server">Waiting on server</p>
            </>
            ) : 
            (null)
        }
        {isError && <p>Network error, try reloading the page.</p>}
        {widgetOpen && <CheckoutContainer />}
        {loading && <LoadEffect />}
      </>
    );
  };
  
export default CreateCharge;