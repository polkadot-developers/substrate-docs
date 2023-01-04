---
title: Explore Sidecar using Postman
description: Demonstrates how you can explore the Sidecar REST API using Postman
keywords:
---

The Substrate [Sidecar](https://github.com/paritytech/substrate-api-sidecar) service provides a REST API for blockchain nodes built using  the Substrate FRAME framework. 
The REST service exposes endpoints for interacting with accounts, transactions, parachains, and other components of the blockchain network. 

In this tutorial, you'll learn how to explore the Sidecar API REST service using Postman, including how to:

- Import a Postman API collection.
- Set up a working environment.
- Make API requests to the Sidecar API.
- Save the data for further use.

## Why use Postman?

Postman is a tool that helps you use and build with APIs. 
It enables collaboration and experimentation in a desktop interface that is accessible to both the newcomer and the experienced API developer. 
In this tutorial, you'll use a [predefined API collection](https://documenter.getpostman.com/view/24602305/2s8YsqWaj8#intro) for Sidecar. 
This predefined API collection is a group of saved requests created in Postman that you can customize and reuse. 
By using API collections that are created with Postman, you have access to features such as inline documentation, reusable variables to access data, error detection in parameter formation, and more.

To use the predefined API collection for Sidecar:
1. Open [Substrate API Sidecar](https://documenter.getpostman.com/view/24602305/2s8YsqWaj8#intro) in a browser.
1. Click **Run in Postman** in the top-right corner of the page. 
1. Select to run the collection either using Postman for the web or in the Postman for Mac desktop client. 
   In you are using a macOS computer, you should run the collection with the desktop client because the desktop client is generally more stable and supports more features.
   If you don't have Postman for Mac installed on your local computer, click **Get the app** to download it.

![First steps with the Postman API collection](/media/images/docs/tutorials/postman-sidecar/first_step.png)

After you open the Substrate API Sidecar collection in Postman, you are ready to start defining your environment variables.

## Define environment variables

The predefined Postman API Collection comes with a built-in development environment named `Dev`. 
This environment lists all the variables you need need in the different API requests to Sidecar. 
They include:

- `url` to specify the URL for your Sidecar REST API. The default local value to define is `http://127.0.0.1:8080`.
- `account` to specify the account identifier of a specific user on the blockchain.
- `number` to specify the number of a specific block from the blockchain.
- `extrensicIndex` to specify the index number of a specific extrinsic in a block.
- `assetId` to specify the identifier of a pallet asset.
- `storageItemId` to specify the identifier of a pallet storage item.
- `paraId` to specify the unique numeric identifier for a specific parachain.

Different sets of requests require different variables to be defined. 
At a minimum, you must set the `url` variable. 
The environment comes with a default value of `http://127.0.0.1:8080`, which is the default REST API address created when booting up an instance of Sidecar. 
If you have set the Sidecar API to use an external hosting location or changed the default local URL, you must change the default value for the `url` variable accordingly.

In this tutorial, you'll query for the list of endpoints and use the `account` variable to query for the balance of a specific account on the blockchain. 
Let's get started!

## Get a list of endpoints

You can use Postman to send a `GET` request to Sidecar to return a list of all the active endpoints available for the API collection. 
This request requires only the `url` variable to be defined.
In most cases, you can use the default value for the local host IP address and port unless you are using Sidecar outside of the locl development environment.

From within the Postman desktop environment navigate to the `GET List of API Endpoints` request and select it.

![Navigating to the correct endpoint](/media/images/docs/tutorials/postman-sidecar/second_step.png)

   After you select the Get the List of API Endpoints request, Postman displays the options available for this request. 
   Because this request only requires the URL and doesn't use any other parameters, there are no settings to configure here. 
   However, for future requests, you can experiment by providing different parameters and seeing the various responses provided by the API.

![Options available for the request](/media/images/docs/tutorials/postman-sidecar/third_step.png)

1. Click **Send**. 

   After you send the request, you should see the response section in Postman populated with data. 
   By default, the data is displayed in JSON format, but you can change response to XML, HTML, or plain text. 
   You should see information similar to the following fields:


```json
{
  "docs": "https://paritytech.github.io/substrate-api-sidecar/dist",
  "github": "https://github.com/paritytech/substrate-api-sidecar",
  "version": "14.1.2",
  "listen": "127.0.0.1:8080",
}
```

At this point, you can save this response to an output file and use it to build against your own application needs. 
You can also save it as a Postman response example added underneath the GET List of API Endpoints menu option. 
This request is great for its simplicity, but in many cases, you'll want to manipulate the values defined for variable to retrieve specific information. 
That's the next step inthis tutorial.

## Get account information

Now that you are familiar with making an uncomplicated request, let's perform another `GET` request but this time modifying the value of one of the environment variables. 
In this request, you'll request the balance for a specific account on the chain. 
Using the [substrate node template](https://github.com/substrate-developer-hub/substrate-node-template) as the working blockchain, this request will query the account balance of the `Alice` user. 
To get the account address for `Alice`, you can spin up the [Substrate Front End Template](https://github.com/substrate-developer-hub/substrate-front-end-template) and copy the account address seen in the browser.

![Copying Alice's Account Address](/media/images/docs/tutorials/postman-sidecar/fourth_step.png)

After you have the account address in your clipboard, return to the Postman client and select **Environments**.
Select the **Dev** environment to display the list of environment variables and their values. 
For each variable, there's an initial value and a current value. 
The `initial value` is what the variable is loaded with when starting a fresh `Dev` environment.
The `current value` is the value for the current session. 
The `current value` is only saved locally and never sent to Postman or shared with other team members using the same Postman API collection.

![Account variable in Postman environment options](/media/images/docs/tutorials/postman-sidecar/fifth_step.png)

Paste the account address for `Alice` into the `current value` text box. 
Click **Collections** and open the **Substrate API Sidecar** collection. 
Select the **Accounts** folder, then select **GET Account Balance Info**.

![Account Balance Info option](/media/images/docs/tutorials/postman-sidecar/sixth_step.png)

You will see that the endpoint is defined with two variables:

```
{{url}}/accounts/{{account}}/balance-info
```

You have just defined the value for the `account` variable, so at this point you are ready to click the `Send` button and receive the response, which will look something like this:

```json
{
    "at": {
        "hash": "0x8e683afdc4d1730d31f8c9a62eacbd839a045f7555cb1bf9528b9136092f00d1",
        "height": "507"
    },
    "nonce": "0",
    "tokenSymbol": "UNIT",
    "free": "1152921504606846976",
    "reserved": "0",
    "miscFrozen": "0",
    "feeFrozen": "0",
    "locks": []
}
```

Similar to the previous example, you can save this as an example response within Postman or save it to an output file to assist in your test fixtures or other uses in your application building.

## What's next?

In this tutorial, you learned how to:

- Import an Postman API collection.
- Define environment variables to use in a collection.
- Send API requests with custom variable definitions.
- Inspect and save the responses from the API. 

You now have a good working basis for using Sidecar within Postman and to continue building on this experience. There are more areas for you to explore on your own, including how to:
-
- Send requests using the other endpoints in the predefined collection.
- Write tests in Postman for debugging purposes
- Set up Postman flows that allow you to connect a series of API REST requests.

While you are exploring, make sure to continue reading more on Sidecar on [GitHub](https://github.com/paritytech/substrate-api-sidecar) and checking out the full offerings of tutorials, guides and references on the [Substrate docs](https://docs.substrate.io/).