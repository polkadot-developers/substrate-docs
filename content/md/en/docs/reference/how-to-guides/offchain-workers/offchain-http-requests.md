---
title: Make offchain HTTP requests
description:
keywords:
  - off-chain worker
  - ocw
  - http
  - https
  - requests
---

This guide steps through making an HTTP request using an offchain workeR, to GET or POST data offchain.

Off-chain workers (**OCW** for short) were introduced to extend oracle-like capabilities for Substrate blockchains.
Because a blockchain does not have access to data outside its own network, oracles are a useful tool to enable interactions between on and off-chain worlds.

In this guide we will look through retrieving the price of bitcoin from the `cryptocompare` API as well as submitting data via an OCW API.

Remember that although Rust provides various libraries for issuing HTTP requests, an OCW runs in an [no-std](https://docs.rust-embedded.org/book/intro/no-std.html) environment.
Luckily, Substrate provides us with a few `no_std` libraries we can use to issue HTTP requests to an API.

The Substrate HTTP library supports the following methods:

- GET
- POST
- PUT
- PATCH
- DELETE

## Set a deadline and instantiate an HTTP request

1. Create a deadline of 2 seconds.

   We want to keep the offchain worker execution time reasonable, so we set a hard-coded deadline to 2s to complete the external call.
   You can also wait indefinitely for the response, however you may still get a timeout coming from the host machine.

   ```rust
   let deadline = sp_io::offchain::timestamp().add(Duration::from_millis(2_000));
   ```

1. Initiate an external HTTP GET request.

   ```rust
   let request = http::Request::get("https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD");
   let pending = request.deadline(deadline).send().map_err(|_| http::Error::IoError)?;
   let response = pending.try_wait(deadline).map_err(|_| http::Error::DeadlineReached)??;
   ```

## Read and submit the response

1. First, you must check the response.

   ```rust
   // Let's check the status code before we proceed to reading the response.
   if response.code != 200 {
     log::warn!("Unexpected status code: {}", response.code);
     return Err(http::Error::Unknown)
   }
   ```

1. Read the response.

   ```rust
   let body = response.body().collect::<Vec<u8>>();
   // Create a str slice from the body.
   let body_str = sp_std::str::from_utf8(&body).map_err(|_| {
     log::warn!("No UTF8 body");
     http::Error::Unknown
   })?;
   ```

1. Now, here's how you can submit data to an API via a POST request.

   ```rust
    // Send a POST request
   let request_body = Vec::new();
   let request = http::Request::post("https://reqres.in/api/users", vec![request_body.clone()])
     .add_header("x-api-key", "test_api_key")
     .add_header("content-type", "application/json");

   let pending = request
     .deadline(deadline)
     .body(vec![request_body.clone()])
     .send()
     .map_err(|_| http::Error::IoError)?;

   // Wait for response
   let response = pending
     .try_wait(deadline)
     .map_err(|_| http::Error::DeadlineReached)??;
   ```

## Examples

- [**Offchain Worker Example Pallet** in Substrate](https://github.com/paritytech/substrate/blob/polkadot-v0.9.18/frame/examples/offchain-worker/src/lib.rs#L571-L625)
- [**OCW Pallet** in Substrate Offchain Worker Demo](https://github.com/jimmychu0807/substrate-offchain-worker-demo/blob/master/pallets/ocw/src/lib.rs#L363-#L401)
- [**Offchain HTTP source** in Substrate Core](https://github.com/paritytech/substrate/blob/master/primitives/runtime/src/offchain/http.rs#L63-L76)
