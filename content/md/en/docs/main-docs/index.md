---
title: Substrate empowers developers
featured_image: /media/images/docs/main-docs/technical-freedom.png
---

Substrate takes a modular and flexible approach to blockchain development.
With every design decision, you can choose between the complexity of technical freedom and the ease of developing with predefined modules.

### Ubuntu/Debian

Use a terminal shell to execute the following commands:

```bash
sudo apt update
# May prompt for location information
sudo apt install -y git clang curl libssl-dev llvm libudev-dev
```

### Arch Linux

Run these commands from a terminal:

```bash
pacman -Syu --needed --noconfirm curl git clang
```

The following diagram illustrates the nature of this flexibility.

![Technical freedom vs development ease](/media/images/docs/main-docs/technical-freedom.png)

The main use cases for Substrate blockchains reflect tis sliding scale between technical freedom and development ease.
At one end of the spectrum, you can deploy predefined Substrate nodes with minimal configuration and launch a blockchain with virtually no development effort.
At the other end of the spectrum, you can design and implement a Substrate-based blockchain from scratch, giving you the technical freedom to innovate.

Naturally, the most common use case falls between these two extremes.
In the middle of the spectrum, you can use [FRAME](/v3/runtime/frame)—an acronym for Framework for Runtime Aggregation of Modularized Entities—to create a customized Substrate **runtime**.
With this approach, you can choose how much control you have over the blockchain logic by selecting and configuring the modules—called **pallets**—that you want to use from a library.
If a pallet doesn't exist for the functionality you need, you can use FRAME to create your own custom pallet, then add it to your customized runtime.

## Where to go next

Explore the following resources to learn more.

#### Tell me (read related topics)

- [FRAME and runtime development](/v3/concepts/runtime)
- [Polkadot-JS](../reference/polkadot-js.md)

#### Guide me (related tutorials)

- [Build a local blockchain](../tutorials/01-build-local-blockchain.md)
- [Simulate a two-node network](../tutorials/02-simulate-network.md)
- [Start a private network](../tutorials/03-private-network.md)

#### Show me (related video content)

-

#### Teach me (related how to content)

-
