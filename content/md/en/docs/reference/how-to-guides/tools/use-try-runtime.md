---
title: Use try-runtime
description: How to use `try-runtime` to test a storage migration.
keywords:
  - storage migration
  - testing
  - runtime
  - tooling
---

The `try-runtime` tool enables you to run tests and verify operations in a simulated environment before launching a runtime to production.
This guide demonstrates the basic steps for integrating the `try-runtime` tool into a runtime so you can use it to test a storage migration.

In general, adding the `try-runtime` tool to your runtime is similar to importing pallets.
It involves adding the appropriate dependencies in the correct places and updating the runtime logic to include the `try-runtime` features.
As with pallets, be sure that you are using the appropriate tag or branch for the `try-runtime` tool when adding dependencies to the runtime.

## Add runtime dependencies

1. Open a terminal shell and change to the root directory for the node template.

1. Open the `runtime/Cargo.toml` configuration file in a text editor.

1. Locate the [dependencies] section and note how other pallets are imported.

1. Add the `frame-try-runtime` dependency:
  
   ```toml
   [dependencies]
	 frame-try-runtime = { git = "https://github.com/paritytech/substrate.git", branch = "polkadot-v1.0.0", optional = true }
	 ```

	 Note that you should use the same branch and version information for all of the pallets to ensure that the imported pallets are compatible with each other.
   Using pallets from different branches can result in compiler errors.
   This example illustrates adding the `frame-try-runtime` pallet to the `Cargo.toml` file if the other pallets use `branch = "polkadot-v1.0.0"`.

1. Add the `try-runtime-cli` dependency:

	 ```toml
	 try-runtime-cli = { git = "https://github.com/paritytech/substrate.git", branch = "polkadot-v1.0.0", optional = true }
	 ```

1. Add `frame-try-runtime` to the list of standard features:

    ```toml
		[features]
		default = ["std"]
		std = [
			"codec/std",
			"scale-info/std",
			"frame-try-runtime/std",
			...
		]
		```

1. Add or update `try-runtime` in the `[features]` section in include every pallet in your runtime.
   
	 ```toml
	 try-runtime = [
		 "frame-executive/try-runtime",
		 "frame-try-runtime",
		 "frame-system/try-runtime",
		 "pallet-aura/try-runtime",
		 "pallet-balances/try-runtime",
		 "pallet-nicks/try-runtime",
		 "pallet-grandpa/try-runtime",
		 "pallet-randomness-collective-flip/try-runtime",
		 "pallet-sudo/try-runtime",
		 "pallet-template/try-runtime",
		 "pallet-timestamp/try-runtime",
		 "pallet-transaction-payment/try-runtime",
		]
	```

## Implement try-runtime in the runtime api

1. Add a configuration block for the try-runtime feature.
   
	 ```rust
	 // Implementation of runtime's apis
	 impl_runtime_apis! {
    ...
		/* --snip-- */
    #[cfg(feature = "try-runtime")]
    impl frame_try_runtime::TryRuntime<Block> for Runtime {
        fn on_runtime_upgrade() -> (frame_support::weights::Weight, frame_support::weights::Weight) {
            log::info!("try-runtime::on_runtime_upgrade.");
            // NOTE: intentional unwrap: we don't want to propagate the error backwards, and want to
            // have a backtrace here. If any of the pre/post migration checks fail, we shall stop
            // right here and right now.
            let weight = Executive::try_runtime_upgrade().map_err(|err|{
                log::info!("try-runtime::on_runtime_upgrade failed with: {:?}", err);
                err
            }).unwrap();
            (weight, RuntimeBlockWeights::get().max_block)
        }
        fn execute_block_no_check(block: Block) -> frame_support::weights::Weight {
            Executive::execute_block_no_check(block)
        }
    }
		```

## Add node dependencies

1. Open the `node/Cargo.toml` configuration file in a text editor.

1. Locate the [dependencies] section and note how other pallets are imported.

1. Add the `frame-try-runtime` dependency:
   
	 ```toml
	 frame-try-runtime = { git = "https://github.com/paritytech/substrate.git", branch = "polkadot-v1.0.0", optional = true }
	 ```
1. Add the `try-runtime-cli` dependency:
   
	 ```toml
	 try-runtime-cli = { git = "https://github.com/paritytech/substrate.git", branch = "polkadot-v1.0.0", optional = true }
	 ```

1. Add or update `cli` and `try-runtime` in the `[features]` section.
   
	 ```toml
	 [features]
	 ...
	 cli = [ "try-runtime-cli" ]
	 try-runtime = [ "node-template-runtime/try-runtime", "try-runtime-cli" ]
	 ...
	 ```

## Add command-line subcommands

1. Open the `node/src/cli.rs` file in a text editor.

```rust
/* --snip-- */
/// Try some command against runtime state.
#[cfg(feature = "try-runtime")]
TryRuntime(try_runtime_cli::TryRuntimeCmd),

/// Try some command against runtime state. Note: `try-runtime` feature must be enabled.
#[cfg(not(feature = "try-runtime"))]
TryRuntime,
/* --snip-- */
```

## Add commands

1. Open the `node/src/commands.rs` file in a text editor.

2. Add commands 
  
	 ```rust
	 /* --snip-- */
	 #[cfg(feature = "try-runtime")]
	 Some(Subcommand::TryRuntime(cmd)) => {
		let runner = cli.create_runner(cmd)?;
		runner.async_run(|config| {
			// only need a runtime or a task manager to do `async_run`.
			let registry = config.prometheus_config.as_ref().map(|cfg| &cfg.registry)let task_manager = sc_service::TaskManager::new(
			  config.tokio_handle.clone(),
				registry,
			).map_err(|e| sc_cli::Error::Service(sc_service::Error::Prometheus(e)))?;
			
		  Ok((cmd.run::<Block, service::ExecutorDispatch>(config), task_manager))
		})
	},
	
	#[cfg(not(feature = "try-runtime"))]
	Some(Subcommand::TryRuntime) => {
		Err("TryRuntime wasn't enabled when building the node. \
		You can enable it with `--features try-runtime`.".into())
		},
	/* --snip-- */
	```

If you're using custom pallets in your workspace, make sure you included `try-runtime` in the dependencies inside the `pallets/pallet_name/Cargo.toml` file of your workspace.

## Use the try-runtime

Using the try-runtime tool is similar to writing unit tests.

To use `try-runtime`:

1. Create an externalities instance.

1. Call `execute_with` on instance.

<!--
## Examples

## Resources
-->

## Where to go next

- [Command-line reference: try-runtime](/reference/command-line-tools/try-runtime/)
- [TryRuntime API](https://crates.parity.io/frame_try_runtime/trait.TryRuntime.html)
