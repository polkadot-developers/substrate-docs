Section: Build
Sub-section: Create pallets
Type: reference 

TODO: WIP
## Create custom pallets

Writing a pallet is the first step towards composing custom runtime logic. 
Building ontop of [existing pallets](/relevant-link-here) is common when building a custom runtime. 
For example, one could build an application specific staking pallet that uses the already existing Collective and Balances pallets.

### Pallet architecture 

Building a custom pallet is made easy with FRAME. 
Each part of the pallet is declared using the [`pallet`](https://docs.substrate.io/rustdocs/latest/frame_support/attr.pallet.html) macro which contains a long list of attributes, a few of which are:

- `#[pallet::pallet]`: This mandatory pallet attribute helps define a struct for the pallet, to carry information such as pallet storage which can then easily be accessed.
- `#[pallet::config]`: This mandatory pallet attribute allows defining the configuration trait for the pallet. 
- `#[pallet::call]`: This attribute allows implementing a pallet's dispatchables.
- `#[pallet::error]`: This attribute generates dispatchable errors. 
- `#[pallet::event]`: This attribute generates dispatchable events.
- `#[pallet::storage]`: This attribute generates a storage instance in the runtime along with its metadata.

Although these macros give developers more flexibility to write Rust code, some of these macros enforce particular requirements on function declarations.
For instance, the `Config` trait must be bound by `frame_system::Config` and the `#[pallet::pallet]` struct must be declared as `pub struct Pallet<T>(_);`.

[ insert / use excerpts from : https://docs.substrate.io/v3/runtime/macros/]

There are several architectural considerations to be made when writing a pallet.

- Storage. What will your pallet need to store? Are these items to be stored on or off-chain?
- Dispatchables. What publicly callable functions does your pallet require?
- Transactionality. What dispatchables are designed to atomically modify storage?
- Hooks. Will your pallet be making calls to any runtime hooks?
- Weights. What considerations must be taken into account to generate the correct weights for your disptachables?

### Useful FRAME traits

- Pallet Origin
- Origins: EnsureOrigin, EnsureOneOf
...

### Runtime implementation 

Writing a pallet and implementing it for a runtime go hand in hand.
Your pallet's `Config` trait is what get's implemented for `Runtime` which is a special struct used to compile all implemented pallets in the `construct_runtime` macro. 

- [`parameter_types`](https://docs.substrate.io/rustdocs/latest/frame_support/macro.parameter_types.html) and [`ord_parameter_types`](https://docs.substrate.io/rustdocs/latest/frame_support/macro.ord_parameter_types.html) macros are useful for passing in values to configurable pallet constants.
- [ other considerations like no_std ]
- Minimilistic runtime references
- Side chain architecture references 
- Api endpoints: on_initialize, off_chain workers ?

Write content that links to basic and intermediate how-to guides.

