#![cfg_attr(not(feature = "std"), no_std)]

use ink_lang as ink;

#[ink::contract]
mod erc20 {
    use ink_storage::traits::SpreadAllocate;

    #[ink(event)]
    pub struct Transfer {
    //  ACTION: Create a `Transfer` event with:
    //          * from: Option<AccountId>
    //          * to: Option<AccountId>
    //          * value: Balance
    }

    #[cfg(not(feature = "ink-as-dependency"))]
    #[ink(storage)]
    #[derive(SpreadAllocate)]
    pub struct Erc20 {
        /// The total supply.
        total_supply: Balance,
        /// The balance of each user.
        balances: ink_storage::Mapping<AccountId, Balance>,
    }

    impl Erc20 {
        #[ink(constructor)]
        pub fn new(initial_supply: Balance) -> Self {
            ink_lang::utils::initialize_contract(|contract: &mut Self| {
                contract.total_supply = initial_supply;
                let caller = Self::env().caller();
                contract.balances.insert(&caller, &initial_supply);

                // ACTION: Call `Self::env().emit_event` with the `Transfer` event
                //   HINT: Since we use `Option<AccountId>`, you need to wrap accounts in `Some()`
            })
        }

        #[ink(message)]
        pub fn total_supply(&self) -> Balance {
            self.total_supply
        }

        #[ink(message)]
        pub fn balance_of(&self, owner: AccountId) -> Balance {
            self.balances.get(&owner).unwrap_or_default()
        }

        #[ink(message)]
        pub fn transfer(&mut self, to: AccountId, value: Balance) -> bool {
            self.transfer_from_to(self.env().caller(), to, value)
        }

        fn transfer_from_to(
            &mut self,
            from: AccountId,
            to: AccountId,
            value: Balance,
        ) -> bool {
            let from_balance = self.balance_of(from);
            if from_balance < value {
                return false
            }

            // Update the sender's balance.
            self.balances.insert(&from, &(from_balance - value));

            // Update the receiver's balance.
            let to_balance = self.balance_of(to);
            self.balances.insert(&to, &(to_balance + value));

            // ACTION: Call `self.env().emit_event` with the `Transfer` event
            //   HINT: Since we use `Option<AccountId>`, you need to wrap accounts in `Some()`

            true
        }
    }

    #[cfg(test)]
    mod tests {
        use super::*;

        use ink_lang as ink;

        #[ink::test]
        fn new_works() {
            let contract = Erc20::new(777);
            assert_eq!(contract.total_supply(), 777);
        }

        #[ink::test]
        fn balance_works() {
            let contract = Erc20::new(100);
            assert_eq!(contract.total_supply(), 100);
            assert_eq!(contract.balance_of(AccountId::from([0x1; 32])), 100);
            assert_eq!(contract.balance_of(AccountId::from([0x0; 32])), 0);
        }

        #[ink::test]
        fn transfer_works() {
            let mut contract = Erc20::new(100);
            assert_eq!(contract.balance_of(AccountId::from([0x1; 32])), 100);
            assert!(contract.transfer(AccountId::from([0x0; 32]), 10));
            assert_eq!(contract.balance_of(AccountId::from([0x0; 32])), 10);
            assert!(!contract.transfer(AccountId::from([0x0; 32]), 100));
        }
    }
}
