---
title: Publish custom pallets
description: Suggests how you can publish custom pallets and crates to make them available to the broader community.
keywords:
---

As a blockchain builder or parachain developer, you have access to a large library of specialized pallets that you can assemble to customize your runtime to suite your specific project goals.
To get a general sense of the number of the predefined pallets currently available, explore the Substrate [FRAME repository](https://github.com/paritytech/polkadot-sdk/tree/master/substrate/frame).
The selection of pallets available and the use cases they address is continuously evolving, including with many contributions from community members.

As you begin writing your own custom pallets to execute application-specific logic, you might find that your custom logic would benefit other teams or the broader ecosystem as a whole.
If you have custom pallets that you want to share with the community, you can publish them in a publicly-accessible forum such as GitHub or crates.io.

This tutorial summarizes the steps for publishing your custom pallets and making them available as open source projects for other developers to use.

## Publishing on GitHub

To publish your pallet on GitHub:

1. [Create a GitHub repository](https://help.github.com/en/articles/create-a-repo).

   Select **Public** for the repository visibility.

1. [Push all of the source code](https://help.github.com/en/articles/pushing-to-a-remote) for your pallet to the remote repository.

1. Add a [README](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes) file that describes the functions and usage for your pallet.

1. Add a LICENSE, CODE-OF-CONDUCT, CONTRIBUTING, or other files to the repository, as needed.

After you publish the pallet, other developers can import it into their runtime by including it in the `Cargo.toml` file as follows:

1. Open a terminal shell and change to the root directory for the node template.

1. Open the `runtime/Cargo.toml` configuration file in a text editor.

1. Locate the [dependencies] section.

1. Add a line similar to the following:

   ```toml
   your-pallet-name = { version = "1.0.0", default-features = false, git = "https://github.com/<your-organization-name>/<your-pallet-repo-name>", branch = "<default-or-specific-branch-name" }
   ```

   If you want developers to use a specific tag or commit for importing the pallet, you should include this information in the README.

## Publishing on crates.io

The Rust community maintains the [crates.io](https://crates.io/) website to allow permissionless publishing of any Rust module.
You could learn the procedure by following their guide on how to [publish on crates.io](https://doc.rust-lang.org/cargo/reference/publishing.html).

After you publish the pallet, other developers can import it into their runtime by including it in the `Cargo.toml` file as follows:

1. Open a terminal shell and change to the root directory for the node template.

1. Open the `runtime/Cargo.toml` configuration file in a text editor.

1. Locate the [dependencies] section.

1. Add a line similar to the following:

   ```toml
   your-pallet-name = { version = "<compatible-version>", default-features = false }
   ```

   If you publish the pallet on crates.io, developers don't need to specify a target destination.
   By default, cargo searches for the specified package in the crates.io registry.

## Where to go next

- [Runtime development](/learn/runtime-development/)
- [Custom pallets](/build/custom-pallets/)
- [Use macros in a custom pallet](/tutorials/build-application-logic/use-macros-in-a-custom-pallet/)
- [How-to: Import a pallet](/reference/how-to-guides/basics/import-a-pallet/).
