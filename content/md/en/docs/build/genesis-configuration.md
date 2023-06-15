---
title: Genesis configuration
description:
keywords:
---

The first block produced by any blockchain is typically referred to as the genesis block.
The hash associated with this block is the top-level parent of all blocks produced after that first block.

The Substrate node template provides the genesis configuration—the initial state—for a subset of pallets by default.
As you add custom logic to the runtime—for example, by adding predefined or custom pallets—you might find that you want to modify the genesis configuration to include other storage items or set different initial values.

As you learned in [Chain specification](/build/chain-spec/), the chain specification you use to start a node determines the genesis configuration for that node.
However, the chain specification doesn't create the storage items that get initialized when you start a node.
Instead, the storage items are defined in the pallets included in the runtime as described in [Runtime storage](/build/runtime-storage/).

After you create storage items for the runtime, you can choose whether they should be set to some initial value as part of the genesis configuration and included in the genesis block.  
To specify the storage items that you want to set an initial state for, Substrate provides two specialized FRAME attribute macros.
The macros you can use to initialize storage items as part of the genesis configuration for a chain are:

- The `#[pallet::genesis_config]` macro defines the `GenesisConfig` data type and initializes storage items.
- The `#[pallet::genesis_build]` macro builds the genesis configuration.

These macros are used in combination with the chain specification to define the initial state of the runtime.

## Configure a simple storage value

The following example demonstrates adding a single storage value to the genesis configuration for the `pallet_template`.
By default, the `pallet_template` has one storage item that isn't initialized in the genesis block.
This example illustrates how you can use the `#[pallet::genesis_config]` and `#[pallet::genesis_build]` macros to set an initial value for the storage value as part of the genesis configuration for your chain.

### Configure macros in the pallet

To initialize a storage item for the `pallet_template`:

1. Open a new terminal shell and navigate to the root directory for the node template.
2. Open the `pallets/template/src/lib.rs` file in a text editor.
3. Add the `#[pallet::genesis_config]` macro and add the storage value `something` as the `GenesisConfig` storage item for the pallet.
   For example, add the following macro to the file:
   ```rust
   // Test Genesis Configuration
   #[pallet::genesis_config]
   #[derive(Default)]
    pub struct GenesisConfig {
          pub something: u32,
   }
   ```

````

In this example, the `#[derive(Default)]` macro is required to satisfy a trait bound requirement in `frame_support::traits::GenesisBuild`.

4. Add the `#[pallet::genesis_build]` macro:

 ```rust
 #[pallet::genesis_build]
 impl<T: Config> GenesisBuild<T> for GenesisConfig {
    fn build(&self) { }
 }
````

In this example, there's no special handling for the `build` function to perform.

5. Save your changes and close the file.

6. Verify that the pallet compiles by running the following command:

   ```bash
   cargo build --package pallet-template
   ```

### Configure the chain specification

Now that you have configured the pallet to initialize a storage value in the genesis block, you can set an initial value for that storage item in the chain specification.

1. Open the `node/src/chain_spec.rs` file in a text editor.
1. Add the `TemplateModuleConfig` to the `node_template_runtime`.

   For example:

   ```rust
   use node_template_runtime::{
      AccountId, AuraConfig, BalancesConfig, RuntimeGenesisConfig, GrandpaConfig, Signature, SudoConfig, SystemConfig, TemplateModuleConfig, WASM_BINARY,
   };
   ```

1. Locate the `GenesisConfig` and set the initial value for the `something` storage item.

   For example, in the `node/src/chain_spec.rs` file:

   ```rust
   -> GenesisConfig {
        GenesisConfig {
                system: SystemConfig {
                        // Add Wasm runtime to storage.
                        code: wasm_binary.to_vec(),
                },

                template_module: TemplateModuleConfig {
                       something: 221u32,
                },

                transaction_payment: Default::default(),
        }
      }
   ```

## Adding genesis configuration to the runtime

After you use the [`#[pallet::genesis_config]`](https://paritytech.github.io/substrate/master/frame_support/attr.pallet.html#genesis-config-palletgenesis_config-optional) macro to add the `GenesisConfig` to each pallet where it's needed, you must include the `Config` trait for each pallet in the runtime to enable the runtime to initialize storage items in the genesis block.

All of the `RuntimeGenesisConfig` types for the pallets that included in the construction of the runtime are then aggregated into a single `RuntimeGenesisConfig` type for that runtime.

The aggregated `RuntimeGenesisConfig` implements the [`BuildStorage`](https://paritytech.github.io/substrate/master/sp_runtime/trait.BuildStorage.html) trait to build all of the initial storage items for the runtime.
For example, the node template runtime builds storage items for the following pallets that have a `RuntimeGenesisConfig` specified by default:

- [System pallet](#system-pallet)
- [Aura pallet](#aura-pallet)
- [Grandpa pallet](#grandpa-pallet)
- [Balances pallet](#balances-pallet)
- [TransactionPayment pallet](#transactionpayment-pallet)
- [Sudo pallet](#sudo-pallet)

### System pallet

```rust
#[pallet::genesis_config]
	pub struct GenesisConfig {
		#[serde(with = "sp_core::bytes")]
		pub code: Vec<u8>,
	}
```

### Aura pallet

```rust
#[pallet::genesis_config]
	pub struct GenesisConfig<T: Config> {
		pub authorities: Vec<T::AuthorityId>,
	}
```

### Grandpa pallet

```rust
#[pallet::genesis_config]
	pub struct GenesisConfig {
		pub authorities: AuthorityList,
	}
```

### Balances pallet

```rust
#[pallet::genesis_config]
	pub struct GenesisConfig<T: Config<I>, I: 'static = ()> {
		pub balances: Vec<(T::AccountId, T::Balance)>,
	}
```

### TransactionPayment pallet

```rust
#[pallet::genesis_config]
	pub struct GenesisConfig {
		pub multiplier: Multiplier,
	}
```

### Sudo pallet

```rust
#[pallet::genesis_config]
	pub struct GenesisConfig<T: Config> {
		/// The `AccountId` of the sudo key.
		pub key: Option<T::AccountId>,
	}
```

Because these pallets include the #[pallet::genesis_config] macro with a `RuntimeGenesisConfig` and have the `Config` trait defined in the runtime, they are aggregated into [`node_template_runtime::RuntimeGenesisConfig`](https://paritytech.github.io/substrate/master/node_template_runtime/struct.RuntimeGenesisConfig.html) struct for the runtime:

```rust
pub struct RuntimeGenesisConfig {
    pub system: SystemConfig,
    pub aura: AuraConfig,
    pub grandpa: GrandpaConfig,
    pub balances: BalancesConfig,
    pub transaction_payment: TransactionPaymentConfig,
    pub sudo: SudoConfig,
}
```

Ultimately, the `RuntimeGenesisConfig` is exposed by way of the [`ChainSpec`](https://paritytech.github.io/substrate/master/sc_chain_spec/trait.ChainSpec.html) trait.

For a more complete example of genesis storage configuration for Substrate, see the [chain specification that ships with the Substrate code base](https://github.com/paritytech/substrate/blob/master/bin/node/cli/src/chain_spec.rs).

## Initialize storage items within a pallet

You can use the [`#[pallet::genesis_build]`](https://paritytech.github.io/substrate/master/frame_support/attr.pallet.html#genesis-build-palletgenesis_build-optional) macro to define the initial state of storage items within the pallet itself.
Defining the genesis configuration within a pallet allows you to access the pallet's private functions.

The following example demonstrates using `#[pallet::genesis_config]` and `#[pallet::genesis_build]` to set the initial value of a storage item.
In this example, there are two storage items:

- A list of member account identifiers.
- A specific account identifier that designates a member from the list to be the prime member.

The macros and data types for this example are defined in the `my_pallet/src/lib.rs` file:

```rust
#[pallet::genesis_config]
struct GenesisConfig {
    members: Vec<T::AccountId>,
    prime: T::AccountId,
}

#[pallet::genesis_build]
impl<T: Config> GenesisBuild<T> for GenesisConfig {
    fn build(&self) {
        Pallet::<T>::initialize_members(&self.members);
        SomeStorageItem::<T>::put(self.prime);
    }
}
```

The genesis configuration is defined in the `node/src/chain_spec.rs` file:

```rust
GenesisConfig {
    my_pallet: MyPalletConfig {
        members: LIST_OF_IDS,
        prime: ID,
    },
}
```

You can also use the `genesis_build` macro to define a `GenesisConfig` attribute that is not bound to a particular storage item.
This can be useful if you want to invoke a private helper function within your pallet that sets several storage items, or to invoke a function defined in some other pallets included within your pallet.
For example, using an imaginary private function called `intitialize_members`, the code might look like this:

In `my_pallet/src/lib.rs`:

```rust
#[pallet::genesis_config]
struct GenesisConfig {
    members: Vec<T::AccountId>,
    prime: T::AccountId,
}

#[pallet::genesis_build]
impl<T: Config> GenesisBuild<T> for GenesisConfig {
    fn build(&self) {
        Pallet::<T>::initialize_members(&config.members);
        SomeStorageItem::<T>::put(self.prime);
    }
}
```

In `chain_spec.rs`:

```rust
GenesisConfig {
    my_pallet: MyPalletConfig {
        members: LIST_OF_IDS,
        prime: ID,
    },
}
```
