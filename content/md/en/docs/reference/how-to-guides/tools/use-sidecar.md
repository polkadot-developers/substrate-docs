---
title: Use REST endpoints to get chain data
description:
keywords:
  - node
  - client
  - tooling
---

This how-to guide illustrates using REST endpoints provided by the `sidecar` service to interact with a Substrate blockchain node.

To find the winner of a completed auction we will need to know the block number the auction ended at. Since [Sidecar](https://github.com/paritytech/substrate-api-sidecar) is a stateless API and the auction info is stored at the final block of an auction, once the auction is over we need the block number to make historic queries to retrieve the event and data stored in it.

## Goal

Find the winner of a completed parachain auction using `sidecar`

## Use Cases

Interact with a Substrate blockchain node using a REST service.

## Steps

### 1. Leverage the /experimental/paras/auctions/current endpoint

We will track and store `finishEnd`, `auctionIndex`, and `leasePeriods` in a Database:

- `finishEnd`: This is the last block of the auction. Storing it allows you to query the block at which the auction ended. From that block you can extract the
  lease winning related events. (To query the block: GET /blocks/{finishEnd}.)

- `auctionIndex`: The unique identifier for the auction.

- `leasePeriods`: The available lease period indexes that may be bid on for the specific auctionIndex.

### 2. Using Sidecar to find the auction winners

By storing the `finishEnd` block and looking at the `Leased` events within it, we can see who the auction winners are and what lease periods they were rewarded.

Format the data however is necessary, for example:

```js
auctionIndex: {
    leasePeriods: [
        "11", "12", "13", "14"
    ],
    finishEnd: '200'
}
```

### 3. Query the /blocks/:blockId endpoint

This step queries all blocks at the block height specified in the `finishEnd` field and retrieves all events inside of `on_initialize`. An example response would be:

```js
{
    authorId: ....,
    extrinsics:....
    ...
    on_initialize: {
        events: [
            {
                "method": {
                    "pallet": "slots",
                    "method": "Leased"
                },
                "data": [
                    '1000', // ParaId
                    '5HpG9w8EBLe5XCrbczpwq5TSXvedjrBGCwqxK1iQ7qUsSWFc', // AccountId
                    '1', // LeasePeriod (beginning of the lease period)
                    '4', // LeasePeriod (the count of the lease period)
                    '10000', // Balance (extra balance reserved)
                    '1000000000', // Balance (total balance)
                ]
            },
            {
                "method": {
                    "pallet": "auctions",
                    "method": "AuctionClosed"
                },
                "data": [
                    ...
                ]
            }
        ]
    }
}
```

### 4. Compare your data

Now that you have all the `paraIds` that won slots for that auction, you can compare it with the data relevant to the `auctionIndex`.
Comparing the `leasePeriods` that are available during the active auction to the `leasePeriods` that have been won and denoted in the
`Leased` events (there may be multiple if there are multiple winners) will give you all the winners for that auction.

## Examples

- More guides [here](https://github.com/paritytech/substrate-api-sidecar/tree/master/guides)

## Resources

- [Sidecar documentation](https://github.com/paritytech/substrate-api-sidecar)
- Available [Substrate Sidecar API endpoints](https://paritytech.github.io/substrate-api-sidecar/dist/)
