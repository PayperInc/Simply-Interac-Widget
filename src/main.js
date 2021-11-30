import React from 'react';
import ReactDOM from 'react-dom';
import { WidgetProvider } from "./WidgetContext";
import CreateCharge from './components/CreateCharge/CreateCharge';

const defaultconfig = {
    someDefaultConfiguration: false
};
let widgetComponent = null;

function payper(window){
    let scriptTag = document.getElementById('Payper-Script');

    if (!scriptTag) {
        throw Error(`Cannot find script tag with id Payper-Script`);
    }

    let rawData = scriptTag.getAttribute('data-config');
    rawData = rawData.replace(/'/g, "\"");
    let data = JSON.parse(rawData); 
    
    window['Payper-Widget'] = data.values;

    let placeholder = {};
    (placeholder.q = []).push(['init', data.config]);

    window[window['Payper-Widget']] = placeholder;

    window[window['Payper-Widget']] = apiHandler;
    window['Payper-Widget-Config'] = defaultconfig;

    if (placeholder) {

        let queue = placeholder.q;
        if (queue) {

            for (var i = 0; i < queue.length; i++) {
                apiHandler(queue[i][0], queue[i][1]);
            }
        }
    }    
}

//redis queuing / axios
function apiHandler(api, params) {
    if (!api) throw Error('API method required');
    api = api.toLowerCase();
    let config = window['Payper-Widget-Config'];
    let transactionData = null;

    switch (api) {
        case 'init':
            config = Object.assign({}, config, params);
            window['Payper-Widget-Config'] = config;
            break;
        case 'apidata':
            transactionData = JSON.parse(params);   
            if (widgetComponent) {
                ReactDOM.unmountComponentAtNode(document.getElementById(config.targetElementId));
            }
            widgetComponent = React.createRef();
            ReactDOM.render(
                <div id="widget">
                    <WidgetProvider>
                        <CreateCharge transactionData={transactionData}/>
                    </WidgetProvider>   
                </div>, 
                document.getElementById(config.targetElementId));
            break;
        default:
            throw Error(`Method ${api} is not supported`);
    }
}

payper(window);

export default payper;