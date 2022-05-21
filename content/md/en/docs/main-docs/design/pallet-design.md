Questions for this page:

Scenario: I have my application logic broken up into the pallets my runtime will require. Now I just need to write each pallet and want to know what to consider and how to use the various capabilities of FRAME in the best way.

- What are the recommended steps I should take when designing my pallet from scratch?
- What low level features should I care about when building my pallet? 
- What tools and features are at my disposal for implementing my pallet logic (benchmarking, tests, hooks, genesis config, signed extensions, origins)? 
- What attack vectors should I be mindful about? How to design and test against them?

[WIP]

- pallets that manipulate data, like blog posts. Best practices for storing only the hash on chain.

## FRAME primitives

Substrate comes with an opinionated toolkit for building runtimes in Rust called FRAME.
That said, the runtime can be built in any way, with any language, so long as it can communicate to the client.

The core Substrate codebase ships with [FRAME](/main-docs/fundamentals/runtime-intro), Parity's system for Substrate runtime development that is used for chains like [Kusama](https://github.com/paritytech/polkadot/blob/master/runtime/kusama/src/lib.rs) and [Polkadot](https://github.com/paritytech/polkadot/blob/master/runtime/polkadot/src/lib.rs). 
FRAME defines additional runtime primitives and provides a framework that makes it easy to construct a runtime by composing modules, called [pallets](/main-docs/fundamentals/runtime-intro#pallets). 
Each pallet encapsulates domain-specific logic that is expressed as a set of a [storage items](/main-docs/build/runtime-storage), [events](/main-docs/build/events-and-errors), [errors](/main-docs/build/events-and-errors#errors), and [dispatchable functions](/reference/glossary#dispatch). 
FRAME developers can [create their own pallets](/main-docs/fundamentals/runtime-intro#pallets) and reuse existing pallets, including [over 50 of those shipped with Substrate](/main-docs/fundamentals/runtime-intro#prebuilt-pallets).

![Runtime Composition](/media/images/docs/main-docs/frame-runtime.png)

There are an additional set of primitives that are assumed about a runtime built with the Substrate FRAME. These are:

- `Call`: The dispatch type that can be called via an extrinsic.

- `Origin`: Represents where a call came from. For example, a signed message (a transaction), an
  unsigned message (an inherent extrinsic), or a call from the runtime itself (a root call).

- `Index`: An account index (aka nonce) type. This stores the number of previous transactions
  associated with a sender account.

- `Hashing`: The hashing algorithm being used in the runtime (e.g. Blake2).

- `AccountId`: The type used to identify user accounts in the runtime.

- `Event`: The type used for events emitted by the runtime.

- `Version`: A type which represents the version of the runtime.

Although a lot of core runtime development can be enabled with FRAME and
its related primitives, FRAME is not the only system for developing
Substrate based blockchains.

## Where to go next

- [Runtime development](/main-docs/fundamentals/runtime-intro).
- [Build a local blockchain](/tutorials/get-started/build-local-blockchain).
- [Add a pallet to the runtime](/tutorials/work-with-pallets/add-a-pallet).

### References

- See the
  [primitive types defined in `node-primitives`](/rustdocs/latest/node_primitives/index.html).

- See the
  [`traits` defined in `sp-runtime`](/rustdocs/latest/sp_runtime/traits/index.html).

_[NOTE: Everything below is rough material that hasn't really found its place yet. TODO.]_

**Weights**

Gav: In general, pallets should be written such that it’s impossible for a block to need more weight than the max. There are two occasions where we have historically relaxed this: upgrades and migrations. But in general (and especially for parachains) this won’t work
So it’s best to structure code so that it cannot have unbounded weight.
If it looks like code might need more weight than the block’s max, then that code might need reworking so that it can reduce or split its functionality at a pinch.
 
If a block’s weight is too large then it basically just means that other validators will be unable/unwilling to import it.
This is the desired outcome for a malicious block.
 
Shawn: I think another point to mention about weights is that everything is relative. An overweight block represents a block that takes more than than the allocated time on a specified hardware. People running faster machines are going to be able to import "overweight" blocks no problem. People who are running very crappy computers are not going to be able to import underweight blocks in time.
 
The whole thing we are trying to prevent is that good nodes should not miss their allocated block production slot because someone produced a block that is too big, and then takes them too long to import before they can go ahead and make their own block.
 
Imagine an attack where we know all computers on the network are exactly on par with another. Then a malicious actor would run a bunch of powerful machines, and somehow construct a block which is weighed incorrectly, and is actually very expensive to execute. It would be possible they submit this block a lot, and then the only machines that would be able to keep up and continue to produce blocks would be those powerful nodes. Other nodes would just be constantly behind trying to import blocks.
 
Finally, our weight calculations are known to be quite conservative. We test everything in worst case scenario, and have assumed quite a bit of overhead which does not actually exist in regular blocks. https://www.shawntabrizi.com/substrate-graph-benchmarks/docs/#/results
So we have overestimated the weight of transfer_keep_alive by 50%.
So weights are inherently a bit flexible, but our goal with benchmarking is to be as close to truth as possible about the time to execute some logic, and there is plenty of room to continue and improve that

**Order of pallets (pallet hooks).**

See: https://github.com/paritytech/substrate/blob/9689a131a595b99e60f134d7634f5f4d71969410/frame/support/procedural/src/lib.rs#L347-L351 
/// The population of the genesis storage depends on the order of pallets. So, if one of your
/// pallets depends on another pallet, the pallet that is depended upon needs to come before
/// the pallet depending on it.
→ Explain how this relates to on_initialize
→ Linked PR: https://github.com/paritytech/substrate/pull/10043 
 
to be more precise we should also say that frame_system is executed first, no matter its position.
