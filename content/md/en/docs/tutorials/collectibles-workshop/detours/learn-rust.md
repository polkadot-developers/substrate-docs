---
title: Learn Rust for Substrate
description: Provides a brief introduction to a few core features of Rust that are important for Substrate developers to be familiar with.
keywords:
---

As you learned in [Prepare a working environment](/tutorials/collectibles-workshop/01-prepare/), Substrate is built using the Rust programming language.
This workshop isn’t about learning Rust, but there are a few basic concepts that are unique to Rust and that you should be familiar with to ensure you’ll be successful in completing this workshop.

## Ownership and borrowing

Most languages use either garbage collection or manually encoded operations to allocate and free up memory. 
In Rust, ownership is what controls how programs manage memory. 
At a high level, ownership consists of three simple rules that the compiler checks:

- Each value has an **owner** that’s identified by the variable that holds the value.
- A value can only have one owner at a time.
- If the owner goes out of scope, the value is dropped.

To prevent a value from being dropped when you want to reuse it, you can **borrow** it.
In Rust, you can add an ampersand (&) in front of a variable identifier to indicate that you want to borrow its value. 
By adding the ampersand, you can reuse the value multiple times throughout a function.

## Traits

Traits are similar to interfaces in Java and classes in C++.
Traits enable you to define behavior for a type that can be shared with other types. 
In Substrate, traits provide a flexible abstraction for defining shared behavior that types can have in common.

## Functions that return errors

In Rust, functions must return the `Result` type to handle errors. 
The returned Result is either `Ok()` for success or `Err()` for a failure.
For example:

```rust
match my_function() {
    Ok(value) => value,
    Err(msg) => return Err(msg),
}
```

## Macros

Macros—code that writes code—aren’t unique to Rust, but they simplify code by abstracting code that would otherwise be duplicated.
Substrate uses a lot of macros in both the core runtime logic and in the creation of the individual pallets.
Macros simplify lots of common tasks like creating storage items and defining events and errors.
You'll use a lot of them in the workshop.

## Rust compiler output

One of the many advantages of using a strongly-typed programming language like Rust is that the compiler can catch and describe many common programming errors and coding issues.
In most cases, the warning and error messages even suggest how to fix the errors in your code. 
For example, the compiler will identify mismatched types, unused variables, problems with the number or the type of arguments specified for a function.
In many cases, the Rust compiler also suggests where you can find more information about the problems it has identified. 
If, at any point, your program doesn’t compile, review the compiler messages carefully.
You’ll learn a lot from these messages and often you’ll be able to resolve the issue without digging further.