A library to submit extrinsics to a Substrate node via RPC.
[Go to documentation](https://github.com/paritytech/substrate-subxt).

Rough notes [WIP]:

- What does subxt do?
    - Download the metadata of a substrate node using subxt-cli
    - Generates runtime API from the downloaded metadata 


Architecture / HL :
- ClientBuilder core 
- What the relationship between tokio and jsonrpsee?
- How is subxt different from https://github.com/scs/substrate-api-client/ ?
    - without TypeInfo it's likely stuck in the same way subxt was for a long time: it can work but has to be recompiled for each runtime upgrade.

- What's the difference between using metadata at compile time to generate the API and using metadata at runtime to constuct exstrinsic indices and decode events?

## Reference structure

- what is it used for?
- any requirements? 
- what options/parameters/arguments does it support? 
- command-line examples input/output?


Notes:

- topic is metadata and how it relates to subxt
- what is the metadata problem?
- problem: everyone who develops clients run into this issue: 1. only javascript to interact to substrate and 2. if you want to have multiple substrate chains you need to maintain a registry of types on the client
- solving the problem of clients needing to maintain their own types. 
- Solution is that types are moved to the metadata itself

- subxt is the rust client solution
- purely based on the metadata

**Prelude**
Stack:
- pallets used in runtimes
- they are exposed in frame and metadata
- used in rpcs responses
- which uses scale codec from crate
- that type information is extracted or turned into presentable form with scale-info crate which is able to describe types and derive descriptions for all the types below the stack 

This is preparatory work for tools like subxt to be possible to write.

**What's the lifecycle of a Substrate type?**

Users / use:
- everyone that uses polkadot js could and should be able to use subxt 
- it hasn't been possible to do something robust worth investing outside of the Javascript land.
- This is a tool to be used outside the Wasm context.
- Anyone who's a rust client developer
- Tool for lower level applications, maybe non-browser GUIs
- Benchmarking
- CLI in rust
- Interlay is using it 
- Phala is using it too 
- SGX hardware use cases
- tinkerer hobbyist who prefers Rust
- devops tool / infrastructure stuff
- also runtime engineers

Whats missing?
- event subscription api needs some work
- it used to be opinionated. It should be clear it'll only return an event for an extrinsics. It does the filtering for you. 

Pain points:
- Need to upgrade firmware each time a chain changes (for hardware wallets)
- Previously you needed to recompile substrate every time


Nice to have:
- Not no_std compatible because json_rpsee

See Rust docs

Macros from partiy-scale-codec derive all

Subxt cli:
- encourage usability
- used to download the metadata - creates a json serialized metadata file
- used to generate the api 
- subxt macro uses the metadata file to generate the api
    - It generates a bunch of types and an api in order to submit txns and read from storage

Requirements:
- connects to the rpc of a node 
- node needs to be running rpc

What other things can you put in the module?