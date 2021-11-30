import React, {useContext } from 'react';
import RedirectForm from "./RedirectForm";
import { WidgetContext } from "../../WidgetContext";
import "../../css/payper-style.css";

const Redirect = () => {

  const {
    state,
    actions: { closeWidget },
  } = useContext(WidgetContext);

  return (
    <div>
      <RedirectForm/>
      <p className="exit-button exit-position-middle"><a onClick={() => closeWidget()}>exit</a></p>
    </div>) 
}

export default Redirect;