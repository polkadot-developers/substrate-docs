---
title: Calculate fees
description:
keywords:
  - weights
  - fees
  - runtime
  - FRAME v1
---

This guides steps through the process of customizing `WeightToFee` for your runtime's implementation of `pallet_transaction_payment`.
Fees are broken down into three components:

- **Byte fee** - A fee proportional to the transaction's length in bytes.
  The proportionality constant is a parameter in the Transaction Payment Pallet.
- **Weight fee** - A fee calculated from the [transaction weight](/build/tx-weights-fees).
  The conversion doesn't need to be linear, although it often is.
  The same conversion function is applied across all transactions for all pallets in the runtime.
- **Fee Multiplier** - A multiplier for the computed fee, that can change as the chain progresses.

FRAME provides the [Transaction Payment Pallet](https://paritytech.github.io/substrate/master/pallet_transaction_payment/index.html) for calculating and collecting fees for executing transactions.
It can be useful to modify the way fees are calculated to more accurately charge fees.

## Goal

Customize `WeightToFee` to modify how fees are calculated for your runtime.

## Use Cases

Modify the way fees are calculated, instead of using [`IdentityFee`](https://paritytech.github.io/substrate/master/frame_support/weights/struct.IdentityFee.html) which maps one unit of fee to one unit of weight.

## Steps

### 1. Write the `LinearWeightToFee` struct

In `runtime/src/lib.rs`, create the struct called `LinearWeightToFee` that implements [`WeightToFeePolynomial`](https://paritytech.github.io/substrate/master/frame_support/weights/trait.WeightToFeePolynomial.html).
It must returns a smallvec of `WeightToFeeCoefficient` integers.

`runtime/src/lib.rs`

```rust
pub struct LinearWeightToFee<C>(sp_std::marker::PhantomData<C>);

impl<C> WeightToFeePolynomial for LinearWeightToFee<C>
where
	C: Get<Balance>,
{
	type Balance = Balance;

	fn polynomial() -> WeightToFeeCoefficients<Self::Balance> {
		let coefficient = WeightToFeeCoefficient {
			coeff_integer: C::get(),
			coeff_frac: Perbill::zero(),
			negative: false,
			degree: 1,
		};

		smallvec!(coefficient)
	}
}
```

### 2. Configure `pallet_transaction_payment` in your runtime

Convert the dispatch weight
`type WeightToFee` to the chargeable fee `LinearWeightToFee` (replacing `IdentityFee<Balance>;`):

`runtime/src/lib.rs`

```rust
parameter_types! {
    // Used with LinearWeightToFee conversion.
	pub const FeeWeightRatio: u128 = 1_000;
	// Establish the byte-fee. It is used in all configurations.
	pub const TransactionByteFee: u128 = 1;
}

impl pallet_transaction_payment::Config for Runtime {
	type OnChargeTransaction = CurrencyAdapter<Balances, ()>;
	type TransactionByteFee = TransactionByteFee;

	// Convert dispatch weight to a chargeable fee.
	type WeightToFee = LinearWeightToFee<FeeWeightRatio>;

	type FeeMultiplierUpdate = ();
}
```

## Related material

- [Weights](/reference/glossary#weight)
- [Add benchmarks](/reference/how-to-guides/weights/add-benchmarks/)
- [Use custom weights](/reference/how-to-guides/weights/use-custom-weights)
- [Transaction Weights and Fees](/build/tx-weights-fees)
- [`WeightToFeeCoefficients`](https://paritytech.github.io/substrate/master/frame_support/weights/type.WeightToFeeCoefficients.html)
- [`WeightToFeePolynomial`](https://paritytech.github.io/substrate/master/frame_support/weights/trait.WeightToFeePolynomial.html)
