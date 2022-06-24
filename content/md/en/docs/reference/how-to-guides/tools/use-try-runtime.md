---
title: Use try-runtime
description:
keywords:
  - storage migration
  - testing
  - runtime
  - tooling
---

The `try-runtime` tool is useful for running tests before launching a runtime to production.
This is a simple guide which steps through which dependencies to include and where to include them in order to use it inside a runtime.

## Goal

Include `try-runtime` to use it in a Substrate node.

## Use Cases

Use `try-runtime` to test a storage migration.

## Steps

### 1. Adding `runtime` dependencies

#### In `runtime/Cargo.toml`

Add the FRAME dependency:

```rust
[dependencies]
frame-try-runtime = { git = "https://github.com/paritytech/substrate.git", branch = "polkadot-v0.9.23", optional = true }
try-runtime-cli = { git = "https://github.com/paritytech/substrate.git", branch = "polkadot-v0.9.23", optional = true }

/* --snip-- */
    std = [
    /* --snip-- */
    "frame-try-runtime/std",
]
```

#### In `runtime/Cargo.toml`, for every pallet in your runtime:

```rust
try-runtime = [
	"frame-executive/try-runtime",
	"frame-try-runtime",
	"frame-system/try-runtime",
]
```

#### In `runtime/src/lib.rs`, implement it for your runtime:

```rust
#[cfg(feature = "try-runtime")]
impl frame_try_runtime::TryRuntime<Block> for Runtime {
	fn on_runtime_upgrade() -> Result<(Weight, Weight), sp_runtime::RuntimeString> {
		log::info!("try-runtime::on_runtime_upgrade.");
		let weight = Executive::try_runtime_upgrade()?;
		Ok((weight, BlockWeights::get().max_block))
	}
}
```

### 2. Adding `node` dependencies

#### In `node/Cargo.toml` (always check for the latest version):

```rust
[features]
/* --snip-- */
cli = [
    'try-runtime-cli',
]
try-runtime = [
    "node-template-runtime/try-runtime",
    "try-runtime-cli",
]

/* --snip-- */
frame-try-runtime = { git = "https://github.com/paritytech/substrate.git", branch = "polkadot-v0.9.23", optional = true }
try-runtime-cli = { git = "https://github.com/paritytech/substrate.git", branch = "polkadot-v0.9.23", optional = true }
/* --snip-- */

```

#### In `node/src/cli.rs` add the subcommands:

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

#### In `node/src/commands.rs`, add:

```rust
/* --snip-- */
#[cfg(feature = "try-runtime")]
Some(Subcommand::TryRuntime(cmd)) => {
	let runner = cli.create_runner(cmd)?;
	runner.async_run(|config| {
		// we don't need any of the components of new_partial, just a runtime, or a task
		// manager to do `async_run`.
		let registry = config.prometheus_config.as_ref().map(|cfg| &cfg.registry);
		let task_manager = sc_service::TaskManager::new(
			config.task_executor.clone(),
			registry,
		).map_err(|e| sc_cli::Error::Service(sc_service::Error::Prometheus(e)))?;

		Ok((cmd.run::<Block, Executor>(config), task_manager))
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

### 3. Using `try-runtime`

Just like writing unit tests, to use `try-runtime` create an externalities instance and call `execute_with` on it.

## Examples

## Resources

#### Docs

- [Command-line reference: try-runtime](/reference/command-line-tools/try-runtime/)
- [TryRuntime API](https://crates.parity.io/frame_try_runtime/trait.TryRuntime.html)
