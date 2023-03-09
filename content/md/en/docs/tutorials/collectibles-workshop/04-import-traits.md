---
title: Shared and custom types
description:
tutorial: 1
---

Now that you have the bare bones of the pallet in place, you’re ready to start customizing the code to implement the application-specific interfaces it requires. This is where application design comes into play.
Because FRAME is modular and takes advantage of the flexibility that Rust traits and generic types provide, often you can find the interfaces you need are already provided in `frame_system`, `frame_support`, or in other predefined pallets and you can import them directly into your pallet.

## Import and declare external interfaces

For the `collectibles` pallet, you know you want a ledger of some kind to keep track of who owns which collectibles and a means of transferring collectibles from one account to another.
You also want to make the collectibles unique by incorporating a random value. Luckily, these are fairly common use cases with interfaces that are useful in many contexts, so they are already defined as traits in the `frame_support` library. 

In `frame_support` the traits are:

- `Currency` to enable access to account balances, transfer operations, and the Balance type.
- `Randomness` to enable access to an on-chain random value.

You might remember that Rust traits enable you to define functionality for a particular type that can be shared with other types. 
To take advantage of this, you can import the `Currency` and `Randomness` traits from the `frame_support` module, then define them as types and specify how they behave in the context of the `collectibles` pallet.

In addition to the `Currency` and `Randomness` traits, the `collectibles` pallet requires an interface to specify the maximum number of collectible assets a single user can own. 
For this interface, the `collectibles` pallet defines a `Get<u32>` trait that fetches a `u32` value to specify the `MaximumOwned` constant.

By including these external interfaces in the configuration of the `collectibles` pallet, the `collectibles` pallet will be able to:

- Access and manipulate user accounts and balances.
- Generate on-chain randomness.
- Set a limit on the number of collectibles an single user can own.s

To import and declare these interfaces:

1. Open the `src/lib.rs` file for the `collectibles` pallet in your code editor.

2. Import the `Currency` and `Randomness` traits from the `frame_support` module into your project.

    ```rust
    use frame_support::traits::{Currency, Randomness};
    ```

3. Update the collectibles `Config` trait to declare the `Currency`, `Randomness`, and `Get<u32>` traits.

    ```rust
    #[pallet::config]
    pub trait Config: frame_system::Config {
        type Currency: Currency<Self::AccountId>;
        type CollectionRandomness: Randomness<Self::Hash, Self::BlockNumber>;

        #[pallet::constant]
        type MaximumOwned: Get<u32>;
    }
    ```
   
4. Verify that your program compiles by running the following command:
   
   ```bash
   cargo build --package collectibles
   ```
   
   You can ignore the compiler warnings about unused code for now.

## Add custom types

Substrate supports all the primitive types available in Rust—for example, bool, u8, u32, and other common types.
Substrate also provides several common custom types that are specific to Substrate—such as, `AccountId`, `BlockNumber`, and `Hash`—that are available for you to use through the imported `frame_system` and `frame_support` modules.
You have already imported some external interfaces for the `collectibles` pallet to use.
Now, you can define a few custom properties to describe the collectibles.
To define these custom properties, you'll add two custom types:

- An enumerated data type to list the possible variants for the `Color` property.
- A structure (struct) data type to group the attributes of a `Collectible`.

### Enumerated variants

```rust
 pub enum Color {
            Red,
            Yellow,
            Blue,
            Green
        }
```

The `Collectible` struct consists of the following:

- `unique_id` is an unsigned integer of 16 bytes to ensure that each collectible is a unique entity in the blockchain.
- `price` as an `Option` that returns `Some(value)` if a price is set or `None` to indicate that the collectible isn't for sale.
- `color` for the variant of the custom `Color` type for the collectible.
- `owner` to identify the account that owns the collectible.

Because we've imported the Currency trait, we can also use the `Balance` and `AccountId` types from the Currency interface in the `collectibles` pallet.

Create a type alias for the `Balance` type called `BalanceOf`:

```rust
type BalanceOf<T> =
	<<T as Config>::Currency as Currency<<T as frame_system::Config>::AccountId>>::Balance;
```

Use `BalanceOf` and `AccountId` in the Collectible structure:

```rust
        pub struct Collectible<T: Config> {
            // Unsigned integers of 16 bytes to represent a unique identifier
            pub unique_id: [u8; 16],
            // `None` assumes not for sale
            pub price: Option<BalanceOf<T>>,
            pub color: Color,
            pub owner: T::AccountId,
        }
```

You can check that the code compiles by running the following command:
   
```bash
cargo build --package collectibles
```

You should see that the code compiles with warnings but without errors.
However, if you try to use the custom types at this point, the compiler will complain.
That's because the pallet doesn't yet implement all the traits expected from the custom types.

## Implement required traits

There are several traits that Substrate requires for every data type.
For example, every data type must implement the `Encode` and `Decode` traits that enable data to be serialized and deserialized so that it can be efficiently transferred over the network. 
Luckily, you can use the `#[derive]` macro to implement all the traits the pallet expects from your custom types. 
Add the `#[derive]` marco and the following traits to each custom type:

```rust
#[derive(Clone, Encode, Decode, PartialEq, Copy, RuntimeDebug, TypeInfo, MaxEncodedLen)]
```
