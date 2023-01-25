---
title: Make offchain HTTP requests
description: Illustrates how to use an offchain worker to make HTTP requests.
keywords:
  - offchain worker
  - ocw
  - http
  - https
  - requests
---

Because blockchains typically can't access data that's hosted on servers outside of their own network, they typically use external third-party services—**oracles**—to pull information in from or push information out to locations that are outside of the network.
For Substrate-based blockchains, **offchain workers** (OCW) provide similar capabilities, but with the advantage of being able to access on-chain state.

This guide illustrates how to use an offchain worker to make HTTP requests using GET or POST methods.
In this example, you'll see how to retrieve the price of Bitcoin from the `cryptocompare` API and how to submit data using an offchain worker API.

You might know that Rust provides various libraries for issuing HTTP requests
However, offchain workers run in their own WebAssembly execution environment—a [no-std](https://docs.rust-embedded.org/book/intro/no-std.html) environment—and, therefore don't have access to the standard Rust libraries.
Instead, Substrate provides its own libraries that you can use to issue HTTP requests.

The Substrate HTTP library supports the following methods:

- GET
- POST
- PUT
- PATCH
- DELETE

## Set a deadline and instantiate an HTTP request

In most cases, you want to limit the time allowed for an offchain worker to execute its operations.
For this example, you can set a hard-coded deadline of two seconds to complete the external call.
You can also wait indefinitely for the response.
However, waiting indefinitely might result in a timeout from the host machine.

1. Create a deadline of 2 seconds.

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

1. Check the response status code.

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

1. Submit data to an API using a POST request.

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

- [Example pallet: Offchain worker](https://github.com/paritytech/substrate/blob/master/frame/examples/offchain-worker/src/lib.rs)
- [Demo: OCW pallet](https://github.com/jimmychu0807/substrate-offchain-worker-demo/blob/master/pallets/ocw/src/lib.rs#L363-#L401)
- [Source: Substrate core primitives](https://github.com/paritytech/substrate/blob/master/primitives/runtime/src/offchain/http.rs#L63-L76)
