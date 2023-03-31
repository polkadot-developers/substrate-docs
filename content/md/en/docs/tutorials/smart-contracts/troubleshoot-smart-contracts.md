---
title: Troubleshoot smart contracts
description: Troubleshoot common issues you might encounter when writing and deploying smart contracts.
keywords:
---

This section describes some of the common issues you might encounter when writing and deploying smart contracts on a
Substrate-based blockchain and how you can address them.

## Unexpected epoch change

If you interrupt a running node without properly stopping it—for example, by closing the terminal or if you computer
switches to sleep mode—you might see the following error:

```bash
ClientImport("Unexpected epoch change")
```

If you see this error, restart your node with the following command:

```bash
 substrate-contracts-node --log info,runtime::contracts=debug 2>&1
```

This command clears all of the running node state.
After restarting the node, repeat any steps you performed before the node was shut down.
For example, redeploy any contracts you previously uploaded.
