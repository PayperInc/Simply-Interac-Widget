&nbsp;

![alt text](https://payper-db.herokuapp.com/assets/payper.jpg "Payper Logo")

&nbsp;
&nbsp;

One-click payment.

# Getting Started
___

Create a folder for the Payper source code.

Download the project from the git repository.

The project has been designed so that you don't have to make any modifications to the source code or recompile. Out of the box, it is ready to be installed into your payment page. 

## Compiling

If you haven't already, install yarn.

``npm install --global yarn``

Install Webpack

``npm install --save-dev webpack``

To compile, use the command ``yarn wp`` to call Webpack to do the compiling.

When you're ready, copy the following to your project root:
* build folder
* payper-logo folder
* index.html
* payper.css

## Adding your environment variables

In the payper-widget folder, create a .env file with the follow parameters:

```
PAYPER_BEARER = {Your bearer token}
PAYPER_SECRET = {Your Secret key}
PAYPER_SID = {Your assigned SID}
PAYPER_ENDPOINT = {"sandbox" or "production"}
```

## Adding your Company Logo

Your company logo must be symmetrical and be no larger than 100x100 pixels. 

Within the root directory of the Payper Widget, create a folder called ``payper_logo``.

### Adding Logo Without Recompiling the project

Add your company logo in the ``payper-logo`` folder with the name ``logo.png``. 

If you prefer to use another file type or a different file name, you will have to recompile the project

### Adding Logo with Intent to Recompile

1. Within the ``src\components\CompanyLogo\CompanyLogo`` file, update the line ``9``: 
  * ```<img className="logo-image" src={window.location.href + '/payper_logo/logo.png'} />```
  * Note - the image source path starts within the current folder
2. Replace ``logo.png`` with the file and path of your choice.
3. Recompile ``yarn wp``

## Adding the Widget to your Checkout Page

Your checkout page will need a dedicated ```<div>``` to be the Payper Widget's home. Call this ```<div id="payper-widget">``` .

### Calling the Payper Widget

Insert this script into your payment page;

```
<script src="./build/index.js" id="Payper-Script" data-config="{'values': 'sendValues','config': {'targetElementId': 'payper-widget'}}" >
  (function (w, d, s, o, f, js, fjs) {
    w['Payper-Widget'] = o; w[o] = w[o] || function () { (w[o].q = w[o].q || []).push(arguments) };
    js = d.createElement(s), fjs = d.getElementsByTagName(s)[0];
    js.id = o; js.src = f; js.async = 1; fjs.parentNode.insertBefore(js, fjs);
  }(window, document, 'script', 'sendValues', './build/index.js'));
  w1('init', { targetElementId: 'payper-widget' });
</script>
```

Make sure the ```scr``` attribute accurately points to the folder.

The script will consume the JSON when the button is clicked. 

### Adding the Payment Button

The ```Pay with Payper``` button will call the function to deliver the JSON payload to the Payper Widget:

```
<button onclick="sendValues('apidata', [JSON]);">Pay with Payper</button>
```

The ``[JSON]`` object must be passed in to the function.

### Some notes

1. Do not use forms on the same page as the widget. 

2. No empty cart items can be passed in the JSON Object.


## The JSON Object

Your payment information will be sent to the Payper Widget via JSON payload. 

```
{
    "sid_info": [{
       "sid":"",
       "type":"",
    }],
    "company_name":"",
    "return_url":"",
    "udf1":"",  
    "udf2":"",  
    "udf3":"",  
    "udf4":"",  
    "udf5":"",  
    "udf6":"",
    "first_name":"",
    "last_name":"",
    "email":"",
    "address":"",
    "city":"",
    "state":"",
    "zip_code":"",
    "items": [{
        "name":"",
        "unit_price":"",
        "quantity":""
    }],
    "amount_shipping":"",
}
```

## JSON Parameters

|  Paramater | Description | Type | Requirement | 
| --- | --- | --- | --- |
| <b>Account Information</b> |
| ``sid_info`` | Array of SID information | <i>array</i> | <b>required</b> |
| ``sid`` | sid number provided by Payper. e.g. ``123`` | <i>integer</i> | <b>required</b> |
| ``type`` | description of sid level ``standard`` or ``enhanced`` | <i>string</i> | <b>required</b>
| <b>Customer Information</b> |
| ``first_name`` | Customer's first name | <i>string</i> | <b>required</b>
| ``last_name`` | Customer's last name | <i>string</i>  | <b>required</b>
| ``email`` | Customer's email address | <i>string</i> | <b>required</b>
| ``phone `` | Customer's phone number | <i>string</i> | <b>required</b>
| ``address`` | Customer's street address | <i>string</i> | <b>required</b>
| ``city `` | Customer's city | <i>string</i> | <b>required</b>
| ``state`` | Customer's state |  <i>string</i> | <b>required</b>
|  | <i>ISO format - 2/3 characters</i> |
| ``country `` | Customer's country | <i>string</i> | <b>required</b>
|  | <i>ISO format - 2 characters</i>  |
| ``zip_code`` | Customer's Zip/Postal Code | <i>string</i> | <b>required</b> |
|  | <i>USA customers: 5-digit ZIP code (eg. "12345")</i> |
|  | <i>Canadian customers: 6-character alphanumeric postal code (eg. "A1A 1A1")</i> |
| <b>Merchant URLs</b> |
| ``return_url`` | The URL to return the customer to after processing | <i>string</i> | <b>required</b>
|  <b>Cart Information</b> |
| ``items`` | array of unit_price, quantity, name | <i>array</i> | <b>required</b>
| ``unit_price`` | The amount that you want to charge per unit, e.g. 10.00 if you would want to charge $10.00 per unit | <i>decimal</i> | <b>required</b>
| ``quantity`` | The number of units purchased | <i>integer</i> | <b>required</b>
| ``name`` | The name of the item being purchased - for display to customer | <i>string</i>  | <b>required</b> |
| ``amount_shipping`` | Specify the shipping cost. This value is added to the total of the cart before charging | <i>decimal</i> | <b>required</b>
| ``udf1 - udf6`` | User defined fields 1 through 6. These can be used to reference your internal transaction number, etc. These fields are returned unmodified in the response | <i>string</i> | <b>At least one UDF is required<b>
|   | Note: at least one of the UDF fields must be unique to each transaction. | 
|   | e.g. ``UDF1`` = ``transactionNumber``, ``UDF2`` = ``Date``, ``etc...`` |

# Transaction Status Flow

## Interac e-Transfer (Deposit/Payment)

| Action/Status | Description |
|---|---|
| <b>Initial Combinations:</b> |  |
| Action: ``REQUEST``  Status: ``APPROVED``| Transaction request has been received, waiting for customer to complete. |
| Action: ``REQUEST`` Status: ``DECLINED``| Transaction has been declined.|
| Action: ``REQUEST`` Status: ``PENDING`` | Transaction request has been received and will be processed.|
|  <b>Final Combinations:</b> |  |
| Action: ``PAYMENT`` Status: ``APPROVED``| Payment is successful, fulfill product. |
| Action: ``PAYMENT`` Status:  ``DECLINED``| Payment has been declined. |
|  <b>Follow-up Combinations:</b> |  |
| ``Action: PAYMENT`` Status: ``RETURNED`` | Interac has initiated a return/reversal. |
| Action: ``CHARGEBACK`` Status: ``APPROVED``| Customer has initiated a chargeback. |
| Action: ``REFUND`` Status: ``PENDING`` | Refund request received. |
| Action: ``REFUND`` Status: ``APPROVED`` | Refund has been approved. |
| Action: ``REFUND`` Status: ``DECLINED`` | Refund has been declined.

## Interac Online (Deposit/Payment)

| Action/Status | Description |
|---|---|
| <b>Initial Combinations:</b> |
| Action: ``PAYMENT`` Status: ``PENDING`` | Transaction request has been received, waiting for customer to complete. |
| <b>Final Combinations:</b> |
| Action: ``PAYMENT`` Status: ``APPROVED``  | Payment is successful, fulfill product. |
| Action: ``PAYMENT`` Status: ``DECLINED`` | Payment has been declined.
