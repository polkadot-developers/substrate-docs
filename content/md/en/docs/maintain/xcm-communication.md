---
title: Cross consensus communication
description:
keywords:
  - XCM
  - XCMP
  - Polkadot
  - parachain
  - relay chain
---

Cross-consensus communication relies on a message format—XCM—that is designed to provide a generalized and extensible set of instructions for completing transactions across boundaries created by different consensus systems, transaction formats, and transport protocols.

The XCM message format describes the content of the message.
It expresses the set of instructions being requested by a sender that can be accepted or rejected by a message recipient. 
The message format is completely independent of the message protocol used to send and receive messages. 

Polkadot implements several cross-consensus protocols to transport XCM messages between consensus environments (chains).

Vertical message-passing (VMP) protocols:
UMP (Upward Message Passing): from a parachain to its relay chain.
DMP (Downward Message Passing): from a relay chain to one of its parachains.

Horizontal (parachain-to-parachain) transport protocols:
XCMP: allows parachains to exchange messages with other parachains on the same Relay Chain.
HRMP (= XCMP-lite): stop-gap protocol for XCMP, which routes messages via the relay chain. Will be deprecated when XCMP goes live.

XCM is well-versioned, abstract and general and can be used as a means of providing a long-lasting transaction format for wallets to use to create many common transactions. It is extensible and, in turn, future-proof and forwards-compatible.

XCM version history:
V0, V1: Initial iterations, not production-ready.
V2: Current version, live on Kusama / Polkadot (and parachains). This workshop focuses on XCM V2.
V3: Upcoming XCM version, with support for non-fungible assets, improved fee handling mechanisms, transport messages across bridges.