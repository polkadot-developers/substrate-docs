Section: Design
Sub-section: Economic models
Type: reference + conceptual

_Suggested reading material: [Blockchain basics](), [Consensus]() and [FRAME]()._

All blockchains require resources—processors, memory, storage, and network bandwidth—to perform operations.
The computers that participate in the network—the authoring nodes that produce blocks—provide these resources to blockchain users.
Together, these computers create a distributed, decentralized network that serves the needs of a community of participants.

To support a community and make a blockchain sustainable, most blockchains require users to pay for the network resources they use in the form of transaction fees.
The payment of transaction fees requires user identities to be associated with accounts that hold assets of some type.
Blockchains typically use cryptographic tokens to represent different assets account can hold and these tokens are made available for purchase outside the chain through an exchange.
Network participants can then deposit the tokens to participate as validators by staking their funds or can use them make transactions on the network by paying fees.

Common use cases for an underlying network token:

- **To keep an account alive.** Any account requires a minimum deposit-called the existential deposit-to prevent users from draining resources without the ability to pay for consuming those resources.

- **To participate in governance.** Most blockchains also enable network participants to submit and vote on proposals that affect network operations or the blockchain community.
By submitting and voting on proposals—referenda—the blockchain community can determine how the blockchain evolves in an essentially democratic process.

- **To participate in proof-of-stake**. Participants that act as block authoring nodes for the network must maintain a significant stake of funds in a special account called the **stash account**.

## Economic systems in FRAME

The use of tokens is a fundamental requirement to power any blockchain system &mdash; the only thing a blockchain really understands is the underlying unit of account used to pay network fees and thus, required in applications that allow users to submit transactions to the blockchain. 
At a high level, tokens are used to bootstrap incentive schemes that **reward** good behavior or **slash** bad behaving participants in staking, governance, or for any on-chain participation. 

FRAME provides a way to design a runtime capable of handling generic economic systems by creating runtimes with the following layers:

- **An underlying currency layer.** The currency system provides an abstraction over the way a chain understands balances and accounts, making it an integral part of the runtime, responsible for critical system level operations that rely on the underlying token used in rewarding network validators.
This capability is provided by the [balances]() pallet and FRAME's [currency trait]() which allows developers to write deposit, locking, tipping or slashing logic for any type of asset an account can hold.

- **A transaction payment handling layer**. Custom logic for handling and administering transaction fees.
This is where the fees are calculated and the tipping logic is implemented. 
Read the documentation about how this is implemented in FRAME's [transaction payment pallet](https://paritytech.github.io/substrate/master/pallet_transaction_payment/index.html).

- **A token implementation layer**. These are mechanisms built ontop of a blockchain's underlying currency system, to be used either as application-specific units of value or as alternative currencies for participating in the network such as multi-asset staking or voting mechanisms.
The FRAME library provides the [assets]() palelt for fungible token types and the [uniques]() pallet for non-fungible token types to allow developers to build applications that require different value bearing token types.



