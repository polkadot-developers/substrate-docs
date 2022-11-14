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
