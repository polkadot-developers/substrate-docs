
#![cfg_attr(not(feature = "std"), no_std)]

use ink_lang as ink;

#[ink::contract]
mod incrementer {
    use ink_storage::traits::SpreadAllocate;

    #[ink(storage)]
    #[derive(SpreadAllocate)]
    pub struct Incrementer {
        value: i32,
        my_value: ink_storage::Mapping<AccountId, i32>,
    }

    impl Incrementer {
        #[ink(constructor)]
        pub fn new(init_value: i32) -> Self {
            // This call is required in order to correctly initialize the
            // `Mapping`s of our contract.
            ink_lang::utils::initialize_contract(|contract: &mut Self| {
                contract.value = init_value;
                let caller = Self::env().caller();
                contract.my_value.insert(&caller, &0);
            })
        }

        #[ink(constructor)]
        pub fn default() -> Self {
            // Even though we're not explicitly initializing the `Mapping`,
            // we still need to call this
            ink_lang::utils::initialize_contract(|contract: &mut Self| {
                contract.value = Default::default();
            })
        }

        #[ink(message)]
        pub fn get(&self) -> i32 {
            self.value
        }

        #[ink(message)]
        pub fn inc(&mut self, by: i32) {
            self.value += by;
        }

        #[ink(message)]
        pub fn get_mine(&self) -> i32 {
            self.my_value.get(&self.env().caller()).unwrap_or_default()
        }

        #[ink(message)]
        pub fn inc_mine(&mut self, by: i32) {
            // ACTION: Get the `caller` of this function.
            // ACTION: Get `my_value` that belongs to `caller` by using `get_mine()`.
            // ACTION: Insert the incremented `value` back into the mapping.
        }

        #[ink(message)]
        pub fn remove_mine(&self) {
            // ACTION: Clear the value at that belongs to `caller` from storage.
        }
    }

    #[cfg(test)]
    mod tests {
        use super::*;

        use ink_lang as ink;

        #[ink::test]
        fn default_works() {
            let contract = Incrementer::default();
            assert_eq!(contract.get(), 0);
        }

        #[ink::test]
        fn it_works() {
            let mut contract = Incrementer::new(42);
            assert_eq!(contract.get(), 42);
            contract.inc(5);
            assert_eq!(contract.get(), 47);
            contract.inc(-50);
            assert_eq!(contract.get(), -3);
        }

        #[ink::test]
        fn my_value_works() {
            let mut contract = Incrementer::new(11);
            assert_eq!(contract.get(), 11);
            assert_eq!(contract.get_mine(), 0);
            contract.inc_mine(5);
            assert_eq!(contract.get_mine(), 5);
            contract.inc_mine(10);
            assert_eq!(contract.get_mine(), 15);
        }

        #[ink::test]
        fn inc_mine_works() {
            let mut contract = Incrementer::new(11);
            assert_eq!(contract.get_mine(), 0);
            contract.inc_mine(5);
            assert_eq!(contract.get_mine(), 5);
            contract.inc_mine(5);
            assert_eq!(contract.get_mine(), 10);
        }

        #[ink::test]
        fn remove_mine_works() {
            let mut contract = Incrementer::new(11);
            assert_eq!(contract.get_mine(), 0);
            contract.inc_mine(5);
            assert_eq!(contract.get_mine(), 5);
            contract.remove_mine();
            assert_eq!(contract.get_mine(), 0);
        }
    }
}
