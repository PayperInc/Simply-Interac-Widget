import React, { useContext } from "react";
import { WidgetContext } from "../../WidgetContext";
import axios from "axios";
import {
  selectTransactionData,
  selectBankSelection,
  selectDataForPaymentRequest,
  selectSidInfo,
} from "../../selectors";
import { IoIosArrowForward } from "react-icons/io";
import { env } from "../../constants/environment";
import "../../css/payper-style.css";
import * as CryptoJS from 'crypto-js';

const PaymentMethod = ({ paymentId, paymentName, src, shortName }) => {
  const {
    state,
    actions: { selectPaymentType, finalizePayment, makePaymentRequest, redirectPayment, returnDeclined },
  } = useContext(WidgetContext);

  const { customerEmail } = selectTransactionData(state);
  const bank_id = selectBankSelection(state);
  const preferredBank = selectBankSelection(state);
  const sid_info = selectSidInfo(state);

  const sendPaymentTypeToDb = async (shortName, preferredBank) => {
    console.log("helo")
    console.log(preferredBank)
    await axios.post(`${env}sendPaymentAndBankTypeToDb`, {
      paymentType: shortName,
      preferredBank: preferredBank,
      customerEmail: customerEmail,
    });
  };

  function aesEncrypt (data, key, iv) {
    
    const cipher = CryptoJS.AES.encrypt(data, CryptoJS.enc.Utf8.parse(key), {
        iv: CryptoJS.enc.Utf8.parse(iv), // parse the IV 
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC
    })
    
    return cipher.toString()
 }

  const requestPayment = async (paymentId) => {
    const sid = parseSID(shortName);
    const secret = process.env.PAYPER_SECRET
    const iv = "udfs12"+selectDataForPaymentRequest(state).udf1 + selectDataForPaymentRequest(state).udf2
    const cipher = aesEncrypt(process.env.PAYPER_BEARER, secret, iv)

    makePaymentRequest();
    const res = await axios.post(
      `${env}requestPayment/${paymentId}/${process.env.PAYPER_SID}`,
      selectDataForPaymentRequest(state),
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': cipher
        }
      }
    );

    res && res.data.status === "APPROVED" && finalizePayment(res.data);
    res && res.data.status === "REDIRECT" && redirectPayment(res.data);
    res && res.data.status === "DECLINED" && returnDeclined(res.data);
    res && res.data.status === "ERROR" && returnDeclined(res.data);
  };

  const parseSID = (shortName) => {
    switch (shortName) {
      case "request": {
        return (sid_info.find(function (o) { return o.type === "enhanced" }).sid.toString());
      }
      case "interac": {
        return (sid_info.find(function (o) { return o.type === "enhanced" }).sid.toString());
      }
      case "standard": {
        return (sid_info.find(function (o) { return o.type === "standard" }).sid.toString());
      }
      default:
        console.log(`unrecognized payment type: ${shortName}`);
    };
  };

  // ***********************************************************************
  // ***********************************************************************
  // ***********************************************************************

  return (
    <div className="PaymentMethodContainer"
      onClick={() => {
        sendPaymentTypeToDb(shortName, preferredBank);
        selectPaymentType(paymentId);
        requestPayment(paymentId);
      }}
    >
      <div className="payment-method-item">
        <img className="payment-item-img" src={src} />
        <p>{paymentName}</p>
      </div>

      <IoIosArrowForward />
    </div>
  );
};

export default PaymentMethod;
