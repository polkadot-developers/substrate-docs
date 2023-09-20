---
title: Create a new pallet
tutorial: 1
---

In this workshop, you'll learn how to create a custom Substrate module-called a pallet-that's going to contain the code for your application-specific blockchain.
Pallets are built using FRAME libraries and the Rust programming language.
FRAME includes a lot of specialized macros that make it easy to compose the application logic in a reusable container.
Let's get started by creating a new project and preparing a basic skeleton for the key parts of the Substrate collectibles application.

## Create a new project

Because this workshop is all about demonstrating the full workflow for creating a new module—a new custom pallet—we won't start with the `pallet-template`.
Instead, the first step is to create a new Rust package for the collectibles pallet you'll be building.

To create a project:

1. Open a new terminal, if needed.
   
2. Change to the `workshop-node-template/pallets` directory in your workspace.
   
3. Create a new Rust project for the `collectibles` pallet by running the following command:
   
   ```bash
   cargo new collectibles
   ```

   Note that `cargo` warns you that the new package isn't in the current workspace and there are a few different ways to fix the issue.
   For now, you can ignore the warning and continue preparing the new project.

4. Change to the `collectibles` directory by running the following command:
   
   ```bash
   cd collectibles
   ```

5. View the contents of the `collectibles` directory and and notice that it provides a default `Cargo.toml` and `src/main.rs` program:
   
   ```text
   ├── Cargo.toml
   └── src
    └── main.rs
   ```
   
   In Rust, the `Cargo.toml` file for each package is called the package manifest and it defines configuration settings and dependencies that the package requires.
   The `Cargo.toml` file in the `workshop-node-template/pallets/collectibles` folder defines the dependencies for the `collectibles` package you are building.

   By convention, the source code for Rust projects in Substrate—including pallet modules—is typically in the `src/lib.rs` file.
   By default, Cargo creates a template `src/main.rs` file for new projects.
   For clarity in the workshop, let's rename the main source file for the new module. 
  
6. Rename `src/main.rs` source file by running the following command:
   
   ```bash
   mv src/main.rs src/lib.rs
   ```

   Now that your project files are in place, let's fix that issue that `cargo` warned you about by adding the new project to the current workspace.

## Add the pallet to the workspace

As with other Rust programs, the node template has a `Cargo.toml` manifest file.
In this case, the manifest file describes the workspace members.
To add the new pallet to the workspace:

1. Change to the `workshop-node-template` directory in your workspace.

1. Open the `Cargo.toml` file in your code editor.

1. Add the new `pallets/collectibles` pallet as a member of the workspace.
   
   ```toml
   [workspace]
   members = [
     "node",
     "pallets/collectibles",
     "pallets/template",
     "runtime",
   ]
   ```

1. Save your changes and close the file.

## Prepare the project manifest

Your new project is now included in the workspace and ready for you to start configuring.
You already know that the project has a default `Cargo.toml` manifest file and that this file describes the package attributes and dependencies.
Defining package attributes and dependencies is particularly important when developing a blockchain using Substrate and FRAME because the modular development environment enables you to import functionality from one part of code into another part of code and you can take advantage of this to reuse common functionality.

In this workshop, the `collectibles` module is going to be part of the Substrate runtime and its `Cargo.toml` file needs to define some modules it depends on.
For example, two core packages the  `collectibles` module requires are the `frame_system` and `frame_support` modules:

- `frame_system` provides core functionality for working with common data structures and primitives so they are available to all of the pallets that need them, enabling new pallets to be easily  integrated into a runtime and to interact with each other.
- `frame_support` provides core support services for handling function calls that are dispatched to the runtime, defining storage structures, preparing events and errors and core utilities.

In addition to `frame_system` and `frame_support`, the `collectibles` module requires packages to support the type encoding and decoding required to minimize network traffic for the blockchain.
To support encoding and decoding in the SCALE format, the `collectibles` module needs access to the `codec` and `scale-info` packages. 

To update the manifest for the collectibles project:

1. Open the default `Cargo.toml` file for the `collectibles` module in your code editor.

2. Add `frame-support` and `frame-system` to the dependencies.
   
   ```toml
   [dependencies]
   frame-support = { default-features = false, version = "4.0.0-dev", git = "https://github.com/paritytech/polkadot-sdk.git", branch = "polkadot-v1.0.0"}
   frame-system = { default-features = false, version = "4.0.0-dev", git = "https://github.com/paritytech/polkadot-sdk.git", branch = "polkadot-v1.0.0" }
   ```

3. Add `codec` and `scale-info` to the dependencies.
   
   ```toml
   codec = { package = "parity-scale-codec", version = "3.0.0", default-features = false, features = ["derive",] }
   scale-info = { version = "2.1.1", default-features = false, features = ["derive"] }
   ```

1. Add the standard features for these packages to the `Cargo.toml` file to support the native binary target for the runtime.
   
   ```toml
   [features]
   default = ["std"]
   std = [
      "frame-support/std",
      "frame-system/std",
      "codec/std",
      "scale-info/std",
   ]
   ```

   Currently, the Substrate runtime is compiled to both a cross-platform WebAssembly target and platform-specific native binary target.

## Prepare common code sections

You now have the bare minimum of package dependencies that your pallet requires specified in the `Cargo.toml` manifest.
The next step is to prepare a set of common macros to serve as scaffolding for your new pallet.

1. Open `src/lib.rs` in a text editor and delete the template `main()` function.
   
   You now have a clean slate for creating the Substrate collectibles pallet.

2. Prepare the scaffolding for the Substrate collectibles pallet by adding the following common set of marco declarations to the `src/lib.rs`  file:
   
   ```rust
   #![cfg_attr(not(feature = "std"), no_std)]
   
   pub use pallet::*;
   
   #[frame_support::pallet(dev_mode)]
   pub mod pallet {
        use frame_support::pallet_prelude::*;
        use frame_system::pallet_prelude::*;

        #[pallet::pallet]
        #[pallet::generate_store(pub(super) trait Store)]
        pub struct Pallet<T>(_);

        #[pallet::config]
        pub trait Config: frame_system::Config {
        }
   }
   ```

3. Save your changes and close the file.

1. Verify that your program compiles by running the following command:
   
   ```bash
   cargo build --package collectibles
   ```
   
   You can ignore the compiler warnings about unused code for now.
