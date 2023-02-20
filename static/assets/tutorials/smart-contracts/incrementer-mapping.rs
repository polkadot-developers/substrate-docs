#![cfg_attr(not(feature = "std"), no_std)]

#[ink::contract]
mod incrementer {
    use ink::storage::Mapping;

    #[ink(storage)]
    pub struct Incrementer {
        value: i32,
        my_map: Mapping<AccountId, i32>,
    }

    impl Incrementer {
        #[ink(constructor)]
        pub fn new(init_value: i32) -> Self {
            let mut my_map = Mapping::default();
            let caller = Self::env().caller();
            my_map.insert(&caller, &0);

            Self {
                value: init_value,
                my_map,
            }
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
            let caller = self.env().caller();
            self.my_map.get(&caller).unwrap_or_default()
        }

        #[ink(message)]
        pub fn inc_mine(&mut self, by: i32) {
            let caller = self.env().caller();
            let my_value = self.get_mine();
            self.my_map.insert(caller, &(my_value + by));
        }

        #[ink(message)]
        pub fn remove_mine(&self) {
            let caller = self.env().caller();
            self.my_map.remove(&caller)
        }
    }

    #[cfg(test)]
    mod tests {
        use super::*;

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
        fn my_map_works() {
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
