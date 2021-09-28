
#![cfg_attr(not(feature = "std"), no_std)]

use ink_lang as ink;

#[ink::contract]
mod incrementer {

    #[ink(storage)]
    pub struct Incrementer {
        // ACTION: Create a storage value called `value` which holds a `i32`
    }

    impl Incrementer {
        #[ink(constructor)]
        pub fn new(init_value: i32) -> Self {
            // ACTION: Create a new `Incrementer` and set its `value` to `init_value`
        }

        // ACTION: Create a second constructor function named `default`.
        //         It has no input, and creates a new `Incrementer` with its `value`
        //         set to `0`.

        #[ink(message)]
        pub fn get(&self) {
            // Contract Message
        }
    }

    #[cfg(test)]
    mod tests {
        use super::*;
        use ink_lang as ink;

        #[ink::test]
        fn default_works() {
            Incrementer::default();
        }
    }
}
