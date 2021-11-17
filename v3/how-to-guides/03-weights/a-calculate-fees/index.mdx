---
title: Calculating Fees
slug: /how-to-guides/v3/weights/calculate-fees
keywords: weights, fees, runtime, FRAME v1
version: '3.0'
section: how to guides
category: weights
---

<Objectives
  data={[
    {
      title: 'Goal',
      description:
        'Customize `WeightToFee` to modify how fees are calculated for your runtime.',
    },
    {
      title: 'Use Cases',
      description: `Modify the way fees are calculated, instead of using [\`IdentityFee\`](/rustdocs/latest/frame_support/weights/struct.IdentityFee.html) which maps one unit of fee to one unit of weight.`,
    },
    {
      title: 'Overview',
      description: `This guides steps through the process of customizing \`WeightToFee\` for your runtime's implementation of \`pallet_transaction_payment\`.
		Fees are broken down into three components:
- **Byte fee** - A fee proportional to the transaction's length in bytes. The proportionality 
constant is a parameter in the Transaction Payment Pallet.
- **Weight fee** - A fee calculated from the [transaction's weight](/v3/runtime/weights-and-fees). The conversion doesn't 
need to be linear, although it often is. The same conversion function is applied across all 
transactions for all pallets in the runtime.
- **Fee Multiplier** - A multiplier for the computed fee, that can change as the chain progresses.
FRAME provides the [Transaction Payment Pallet](/rustdocs/latest/pallet_transaction_payment/index.html)
for calculating and collecting fees for executing transactions. It can be useful to modify 
the way fees are calculated to more accurately charge fees.`,
    },
  ]}
/>

## Steps

### 1. Write the `LinearWeightToFee` struct

In `runtime/src/lib.rs`, create the struct called `LinearWeightToFee` that implements
[`WeightToFeePolynomial`](/rustdocs/latest/frame_support/weights/trait.WeightToFeePolynomial.html).
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

## Examples

- [`transaction-payment-pallet`][transaction-frame]

## Related material

#### How-to guides

- [Add benchmarking to your runtime](/how-to-guides/v3/weights/add-benchmarking)
- [Use benchmarked weights in your pallet](/how-to-guides/v3/weights/use-benchmark-weights)

#### Docs

- [Weights in Substrate](/v3/concepts/weight)
- [Transaction Weights and Fees](/v3/runtime/weights-and-fees)

#### Rust docs

- [`WeightToFeeCoefficients`](/rustdocs/latest/frame_support/weights/type.WeightToFeeCoefficients.html)
- [`WeightToFeeCoefficient`](/rustdocs/latest/frame_support/weights/type.WeightToFeeCoefficient.html)
- [`WeightToFeePolynomial`](/rustdocs/latest/frame_support/weights/trait.WeightToFeePolynomial.html)

[transaction-frame]: https://github.com/paritytech/substrate/tree/master/frame/transaction-payment
