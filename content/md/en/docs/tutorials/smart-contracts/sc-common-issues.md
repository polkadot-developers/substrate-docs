---
title: Troubleshoot smart contracts
slug: /tutorials/smart-contracts/sc-common-issues/
description:
keywords:
  - smart contracts
  - erc20
  - wasm
featured_image: /tutorial-card-images/tuts-4.jpg
---

This section describes some of the common issues you might encounter when writing and deploying smart contracts on a Substrate-based blockchain and how you can address them.

## Unexpected epoch change

If you interrupt a running node without properly stopping it—for example, by closing the terminal or if you computer switches to sleep mode—you might see the following error:

```bash
ClientImport("Unexpected epoch change")
```

If you see this error, restart your node with the following command:

```bash
substrate-contracts-node --dev
```

This command clears all of the running node state.
After restarting the node, repeat any steps you performed before the node was shut down.
For example, redeploy any contracts you previously uploaded.

### Outdated contracts in local storage

The Contracts UI uses its own local storage to track the contracts that you have deployed.
If you deploy a contract using the Contracts UI, then purge chain data for your node, you are prompted to
reset your local storage.
After you reset local storage for the Contracts UI, repeat any steps you performed before purging the node and redeploy any contracts you previously uploaded.
