#![cfg_attr(not(feature = "std"), no_std)]

use ink_lang as ink;

#[ink::contract]
mod erc20 {
    use ink_storage::traits::SpreadAllocate;

    #[ink(event)]
    pub struct Transfer {
        #[ink(topic)]
        from: Option<AccountId>,
        #[ink(topic)]
        to: Option<AccountId>,
        #[ink(topic)]
        value: Balance,
    }

    // ACTION: Add an `Approval` event
    //         It should emit the following:
    //         * `owner` as an `AccountId`
    //         * `spender` as an `AccountId`
    //         * `value` as a `Balance`

    #[cfg(not(feature = "ink-as-dependency"))]
    #[ink(storage)]
    #[derive(SpreadAllocate)]
    pub struct Erc20 {
        /// The total supply.
        total_supply: Balance,
        /// The balance of each user.
        balances: ink_storage::Mapping<AccountId, Balance>,
        /// Approval spender on behalf of the message's sender.
        //  ACTION: Add an `allowances` storage item. It should be a
        //          `Mapping` from `(AccountId, AccountId) to `Balance`
    }

    impl Erc20 {
        #[ink(constructor)]
        pub fn new(initial_supply: Balance) -> Self {
            ink_lang::utils::initialize_contract(|contract: &mut Self| {
                contract.total_supply = initial_supply;
                let caller = Self::env().caller();
                contract.balances.insert(&caller, &initial_supply);

                // NOTE: `allowances` is default initialized by `initialize_contract`, so we don't
                // need to do anything here

                Self::env().emit_event(Transfer {
                    from: None,
                    to: Some(caller),
                    value: initial_supply,
                });
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
        pub fn approve(&mut self, spender: AccountId, value: Balance) -> bool {
           // ACTION: Get the `self.env().caller()` and store it as the `owner`
           // ACTION: Insert the new allowance into the `allowances` Mapping
           //   HINT: The key tuple is `(owner, spender)`
           // ACTION: `emit` the `Approval` event you created using these values
           // ACTION: Return true if everything was successful
        }

        #[ink(message)]
        pub fn allowance(&self, owner: AccountId, spender: AccountId) -> Balance {
            // ACTION: Create a getter for the `allowances` Mapping
            //   HINT: Take a look at the getters above if you forget the details
            // ACTION: Return the `allowance` value
        }

        #[ink(message)]
        pub fn transfer_from(
            &mut self,
            from: AccountId,
            to: AccountId,
            value: Balance,
        ) -> bool {
            // ACTION: Get the allowance for `(from, self.env().caller())` using `allowance_of_or_zero`
            // ACTION: `if` the `allowance` is less than the `value`, exit early and return `false`
            // ACTION: `insert` the new allowance into the map for `(from, self.env().caller())`
            // ACTION: Finally, call the `transfer_from_to` for `from` and `to`
            // ACTION: Return true if everything was successful
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

            self.env().emit_event(Transfer {
                from: Some(from),
                to: Some(to),
                value,
            });

            true
        }

        fn allowance_of_or_zero(
            &self,
            owner: &AccountId,
            spender: &AccountId,
        ) -> Balance {
            // ACTION: `get` the `allowances` of `(owner, spender)` and return a default if no
            // allowance exists
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

        #[ink::test]
        fn transfer_from_works() {
            let mut contract = Erc20::new(100);
            assert_eq!(contract.balance_of(AccountId::from([0x1; 32])), 100);
            contract.approve(AccountId::from([0x1; 32]), 20);
            contract.transfer_from(
                AccountId::from([0x1; 32]),
                AccountId::from([0x0; 32]),
                10,
            );
            assert_eq!(contract.balance_of(AccountId::from([0x0; 32])), 10);
        }

        #[ink::test]
        fn allowances_works() {
            let mut contract = Erc20::new(100);
            assert_eq!(contract.balance_of(AccountId::from([0x1; 32])), 100);
            contract.approve(AccountId::from([0x1; 32]), 200);
            assert_eq!(
                contract
                    .allowance(AccountId::from([0x1; 32]), AccountId::from([0x1; 32])),
                200
            );

            assert!(contract.transfer_from(
                AccountId::from([0x1; 32]),
                AccountId::from([0x0; 32]),
                50
            ));
            assert_eq!(contract.balance_of(AccountId::from([0x0; 32])), 50);
            assert_eq!(
                contract
                    .allowance(AccountId::from([0x1; 32]), AccountId::from([0x1; 32])),
                150
            );

            assert!(!contract.transfer_from(
                AccountId::from([0x1; 32]),
                AccountId::from([0x0; 32]),
                100
            ));
            assert_eq!(contract.balance_of(AccountId::from([0x0; 32])), 50);
            assert_eq!(
                contract
                    .allowance(AccountId::from([0x1; 32]), AccountId::from([0x1; 32])),
                150
            );
        }
    }
}

