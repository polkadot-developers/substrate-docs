---
title: Explore Sidecar using Postman
description: Demonstrates how you can explore the Sidecar REST API using Postman
keywords:
---

Substrate's [Sidecar](https://github.com/paritytech/substrate-api-sidecar) provides a REST API for blockchain nodes built using Substrate's FRAME framework. The REST service exposes endpoints for a variety of operations across services such as accounts, transactions, parachains and other areas. 

In this tutorial, you will learn how to explore the Sidecar API REST service using Postman. You will learn how to import a Postman API collection, set up a working environment, make API requests to your Sidecar API and save the data for further use.

## Why use Postman?

Postman is a tool that helps you use and build with APIs. It enables collaboration and experimentation in a desktop interface that is accessible to both the newcomer and the experienced API developer. In this tutorial, you will be using a pre-defined API collection for Sidecar. A Postman API collection is a group of saved requests that are customizable by the user. API collections within Postman have great features such as in-line documentation, variables to be able to reuse data across requests, error detection in parameter formation, and more.

The Postman API collection for Sidecar we will be using can be found [here](https://documenter.getpostman.com/view/24602305/2s8YsqWaj8#intro). Once you have the link open in your browser, go ahead and click first on the button in the top-right corner of the page, `Run on Postman` then choose either to run the collection in the Postman for the web or in the desktop client. The desktop client is overall more stable and feature-rich and is recommended.

![First steps with the Postman API collection](/media/images/docs/tutorials/postman-sidecar/first_step.png)

Once you have done that, you are now ready to move on to the next step, which is defining your environment variables.

## Defining Environment Variables

The pre-defined Postman API Collection comes with a ready-built development environment named `Dev`. This environment lists all the variables you may need in the different API requests to Sidecar. They include:

- `url` - The URL for your Sidecar REST API. The default local value to define is: http://127.0.0.1:8080
- `account` - The account ID of a specific user on the blockchain
- `number` - The number of a specific block from the blockchain
- `extrensicIndex` - The index number of a specific extrensic on a block
- `assetId` - The ID of an pallet asset
- `storageItemId` - The ID of a pallet storage item
- `paraId` - The ID of a specific parachain

Different sets of requests will require different variables to be defined. At a minimum, you must have the `url` variable set. The environment comes with a default value of `http://127.0.0.1:8080`, which is the default REST API address created when booting up an instance of Sidecar. If you have set your Sidecar API to an external hosting location or changed the default local URL, you need to change the default value for the `url` variable accordingly.

In this tutorial, we will query for the list of endpoints, and we will also use the `account` variable to query for the balance of a specific account on the blockchain. Let's get started!

## Getting List of Endpoints

The first action we will perform using Postman is to send a `GET` request to Sidecar to return a list of all the active endpoints available for our API. This request requires only the `url` variable to be defined, and as stated earlier, unless you have changed the default value in your Sidecar initialization or are working outside of your development environment, the value has already been set for you.

From within the Postman desktop environment navigate to the `GET List of API Endpoints` request and select it.

![Navigating to the correct endpoint](/media/images/docs/tutorials/postman-sidecar/second_step.png)

Once you select that option, the main body of the client will change to show you the options available for this request. Since this action takes no parameters, and as such is a great first request to attempt, there is not much here to do. However, for future requests, you can experiment by providing different parameters and seeing the various responses provided by the API.

![Options available for the request](/media/images/docs/tutorials/postman-sidecar/third_step.png)

Go ahead and click on the `Send` button. Once you do, you should very shortly after see the response section of the Postman client become populated with data. It will present the data by default in JSON format, but you can change that to XML, HTML, or plain text. It should start with the following fields:

```json
{
  "docs": "https://paritytech.github.io/substrate-api-sidecar/dist",
  "github": "https://github.com/paritytech/substrate-api-sidecar",
  "version": "14.1.2",
  "listen": "127.0.0.1:8080",
}
```

At this point, you can save this response to an output file and use it to build against your own application needs. You can also save it as a Postman response example, which gets added as a sub-option underneath the `GET List of API Endpoints` selection in the left-hand menubar. This request is great for its simplicity, but what if you need to alter one of the values in the endpoint defined as a variable? That will be our next step.

## Getting User Account Information

Now that you are familiar with making an uncomplicated request, let's perform another `GET` request this time modifying the value of one of the environment variables. In this request, you will request a specific account's balance on the chain. Using the [Substrate Node Template](https://github.com/substrate-developer-hub/substrate-node-template) as our working blockchain, we will query the account balance of the `Alice` user. To quickly get the account address for `Alice`, you can spin up the [Substrate Front End Template](https://github.com/substrate-developer-hub/substrate-front-end-template) and copy the account address seen in the browser.

![Copying Alice's Account Address](/media/images/docs/tutorials/postman-sidecar/fourth_step.png)

Once you have the account address in your clipboard, return to the Postman client, select the `Environments` option from the far left-hand menubar, then select the `Dev` environment. This will bring up the list of environment variables and their values. For each variable you will see two fields: `initial value` and `current value`. The `initial value` is what the variable is loaded with when starting a fresh `Dev` environment, whereas the `current value` is for the current session. Additionally, `current value` is only saved locally and never sent back up to Postman to be shared with other team members using the same Postman API collection.

![Account variable in Postman environment options](/media/images/docs/tutorials/postman-sidecar/fifth_step.png)

As you can see from the screenshot above, the `current value` has been modified with an account address for `Alice`. In your own Postman client, paste the address you copied from the front end template into the `current value` text box. Once you have done so, navigate back to `Collections` from the far left-hand menubar and then back to the `Substrate API Sidecar` collection. From within the collection, choose the `GET Account Balance Info` inside the `Accounts Folder`.

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

## What's Next?

You have accomplished quite a lot in this tutorial! You have successfully imported an Postman API collection, defined environment variables, made API requests in Postman with custom variable definitions, and examined the responses from the API. You now have a good working basis from which to continue to build your experience using Sidecar within Postman. There are more areas for you to explore on your own including writing tests inside Postman for debugging purposes, setting up Postman flows that allow you to connect a series of API REST requests, and just trying out all the other endpoints made available to you.

While you are exploring, make sure to continue reading more on Sidecar on [GitHub](https://github.com/paritytech/substrate-api-sidecar) and checking out the full offerings of tutorials, guides and references on the [Substrate docs](https://docs.substrate.io/).