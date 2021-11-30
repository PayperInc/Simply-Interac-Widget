import React, { useContext, useEffect, useState } from 'react';
import { WidgetContext } from "../../WidgetContext";
import { selectRedirectFields, selectRedirectForm } from "../../selectors/selectors"
import axios from 'axios';
import { env } from "../../constants/environment";
import "../../css/payper-style.css";

const RedirectForm = () => {

    const {
      state,
      actions: {redirectFormAction},
    } = useContext(WidgetContext);

    let redirectFormHTML = selectRedirectForm(state);  
    const redirectFields = selectRedirectFields(state);
  
    const getRedirect = async (redirectFields) => {
        const res = await axios.post(
            `${env}redirectInterac`,redirectFields
        )
        .then(
            res && !redirectFormHTML && redirectFormAction(res.data)
        );          
    };

    const decodedHTML = (HTML) => {
        const extractscript = (/<script>(.+)<\/script>/gi.exec(HTML));
        const decoded = HTML.replace(extractscript[0],""); 
        return decoded;
    }

    const evalForm = () => {
        useEffect(
            () => {
                window.eval(document.forms[0].submit());
            },[]
        );
    }

    return (
        <div onLoad={() => {
            getRedirect(redirectFields);
        }}>
            <div className="standard-div">Redirecting to Interac</div>
            <div dangerouslySetInnerHTML={{__html: decodedHTML(redirectFormHTML)}} /> 
            {evalForm()}  
        </div>
    ); 
}

export default RedirectForm;