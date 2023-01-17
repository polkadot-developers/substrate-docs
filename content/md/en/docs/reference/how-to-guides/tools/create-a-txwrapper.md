---
title: Create a txwrapper for a chain
description: Expand the offline signing options for users of your chain.
keywords:
  - runtime
  - tooling
---

Creating a `txwrapper` package will expand the offline signing options for users of your chain.
This is important for security conscious users who need to facilitate transaction signing, construction and/or decoding with an air-gapped device(s).
This includes (but is not limited to) custodians, exchanges, and cold storage users.

Prior to building a `txwrapper` for your own chain, have a look at the [`txwrapper-examples`](https://github.com/paritytech/txwrapper-core/blob/main/packages/txwrapper-examples/README.md).

Make sure you understand the Polkadot example and take a look at the `txwrapper-core` methods an end user is expected to use (see `decode`, `construct.{signingPayload, signedTx, txHash}`).
Your package will be re-exporting these so be sure to understand the public API you will create.

## Goal

Structure the public API of a chain's `txwrapper` package.

## Use cases

For existing `txwrapper` users to easily integrate new txwrappers.

## Steps

### 1. Create a repo using `txwrapper-template`

Copy the [`txwrapper-template`](https://github.com/paritytech/txwrapper-core/tree/main/packages/txwrapper-template) directory into your working repository.

The template provides the basics of a typescript package near ready for being published to `NPM`. The exports show some methods that are relevant to a FRAME based chain using at least the `balances`, `proxy`, and `utility pallets`.

Note that the [`txwrapper-core\`](https://github.com/paritytech/txwrapper-core) is re-exported at the top level to give the user access to its tools.

### 2. Update package.json

Modify the following fields to reflect your chains information:

- name
- author
- description
- repository
- bugs
- homepage
- private (mark as false)

Additionally, add the following field to give publishing permission:

```js
  "publishConfig": {
    "access": "public"
  },
```

### 3. Choose relevant methods to re-export

You will need to choose what pallet methods you want your `txwrapper` to expose.
It is recommended to choose methods that are likely to be signed by keys stored offline.

If you just need methods from Substrate or ORML pallets, checkout [txwrapper-substrate](https://github.com/paritytech/txwrapper-core/blob/main/packages/txwrapper-substrate/README.md) and [txwrapper-orml](https://github.com/paritytech/txwrapper-core/blob/main/packages/txwrapper-orml/README.md) to see if the methods are already defined.

### 4. Create a getRegistry method

Your txwrapper will need to export a `getRegistry` method so users can get a Polkadot-js `TypeRegistry` with the most up-to-date types for your chain.

With some small modifications, the `foo` example below can be applied to any `FRAME`-based chain compatible with Polkadot-js types:

```js
// src/index.ts

import { typesBundleForPolkadot } from '@foo-network/type-definitions';
import { OverrideBundleType } from '@polkadot/types/types';
import {
  getRegistryBase,
  GetRegistryOptsCore,
  getSpecTypes,
  TypeRegistry,
} from '@substrate/txwrapper-core';

// As a convenience to users we can provide them with hardcoded chain properties
// as these rarely change.
/**
 * `ChainProperties` for networks that txwrapper-foo supports. These are normally returned
 * by `system_properties` call, but since they don't change much, it's pretty safe to hardcode them.
 */
const KNOWN_CHAIN_PROPERTIES = {
  foo: {
    ss58Format: 3,
    tokenDecimals: 18,
    tokenSymbol: 'FOO',
  },
  bar: {
    ss58Format: 42,
    tokenDecimals: 18,
    tokenSymbol: 'FOO',
  },
};

// We override the `specName` property of `GetRegistryOptsCore` in order to get narrower type specificity,
// hopefully creating a better experience for users.
/**
 * Options for the `getRegistry` function.
 */
export interface GetRegistryOpts extends GetRegistryOptsCore {
  specName: keyof typeof KNOWN_CHAIN_PROPERTIES;
}

/**
 * Get a type registry for networks that txwrapper-foo supports.
 *
 * @param GetRegistryOptions specName, chainName, specVersion, and metadataRpc of the current runtime
 */
export function getRegistry({
  specName,
  chainName,
  specVersion,
  metadataRpc,
  properties,
}: GetRegistryOpts): TypeRegistry {
  const registry = new TypeRegistry();
  registry.setKnownTypes({
    // If your types are not packaged in the `OverrideBundleType` format, you can
    // specify types in any of the formats supported by `RegisteredTypes`:
    // https://github.com/polkadot-js/api/blob/4ff9b51af2c49294c676cc80abc6476565c70b11/packages/types/src/types/registry.ts#L59
    typesBundle: (typesBundleForPolkadot as unknown) as OverrideBundleType,
  });

  return getRegistryBase({
    chainProperties: properties || KNOWN_CHAIN_PROPERTIES[specName],
    specTypes: getSpecTypes(registry, chainName, specName, specVersion),
    metadataRpc,
  });
}
```

And add relevant exports:

```js
// src/methods/currencies/index.ts

// export the method, effectively making available under the `currencies` namespace
export * from "./transfer";
// src/methods

// Export everything from within `methods`, including the `currencies` namespace, making it so we can
// access the method via `methods.currencies.transfer`
export * as methods from "./methods";
```

### 5. Create a working example

A good example can ease user friction and reduce workload for maintainers.
Create an end-to-end example so users have a clear understanding of the full flow for offline transaction generation for your chain.

1. Rename `template-example.ts` to something appropriate to your chain and update all the sections in the file marked TODO.
2. Update `examples/README.md` in the sections marked TODO.
3. Make sure you can run the example using a development node for your chain.

### 6. Publish your package

Once you've made sure that versioning makes sense and that the [package works locally](https://docs.npmjs.com/cli/v6/commands/npm-pack), refer to [this guide](https://docs.npmjs.com/cli/v6/commands/npm-publish) to learn how to publish your package to `NPM`.

## Examples

- [Template example](https://github.com/paritytech/txwrapper-core/blob/main/packages/txwrapper-template/examples/template-example.ts)

## Resources

- How-to use [`tx-wrapper-polkadot`](https://github.com/paritytech/txwrapper-core/blob/main/packages/)
- Serialization/deserialization [unit tests using `jest`](https://github.com/paritytech/txwrapper-core/blob/main/packages/txwrapper-orml/src/methods/currencies/transfer.spec.ts)
