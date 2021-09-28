#![cfg_attr(not(feature = "std"), no_std)]

use ink_lang as ink;

#[ink::contract]
mod erc20 {
	#[cfg(not(feature = "ink-as-dependency"))]
	#[ink(storage)]
	pub struct Erc20 {
		/// The total supply.
		total_supply: Balance,
		/// The balance of each user.
		balances: ink_storage::collections::HashMap<AccountId, Balance>,
		/// Approval spender on behalf of the message's sender.
		//  ACTION: Add an `allowances` storage item. It should be a
		//         `HashMap` from `(AccountId, AccountId)` to `Balance`
	}

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

	impl Erc20 {
		#[ink(constructor)]
		pub fn new(initial_supply: Balance) -> Self {
			let caller = Self::env().caller();
			let mut balances = ink_storage::collections::HashMap::new();
			balances.insert(caller, initial_supply);

			Self::env().emit_event(Transfer {
				from: None,
				to: Some(caller),
				value: initial_supply,
			});

			Self {
				total_supply: initial_supply,
				balances
			}
		}

		#[ink(message)]
		pub fn total_supply(&self) -> Balance {
			self.total_supply
		}

		#[ink(message)]
		pub fn balance_of(&self, owner: AccountId) -> Balance {
			self.balance_of_or_zero(&owner)
		}

		#[ink(message)]
		pub fn approve(&mut self, spender: AccountId, value: Balance) -> bool {
			// ACTION: Get the `self.env().caller()` and store it as the `owner`
			// ACTION: Insert the new allowance into the `allowances` HashMap
			//   HINT: The key tuple is `(owner, spender)`
			// ACTION: `emit` the `Approval` event you created using these values
			// ACTION: Return true if everything was successful
		}

		#[ink(message)]
		pub fn allowance(&self, owner: AccountId, spender: AccountId) -> Balance {
			// ACTION: Create a getter for the `allowances` HashMap
			//   HINT: Take a look at the getters above if you forget the details
			// ACTION: Return the `allowance` value
		}

		#[ink(message)]
		pub fn transfer_from(&mut self, from: AccountId, to: AccountId, value: Balance) -> bool {
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

		fn transfer_from_to(&mut self, from: AccountId, to: AccountId, value: Balance) -> bool {
			let from_balance = self.balance_of_or_zero(&from);
			if from_balance < value {
				return false
			}

			// Update the sender's balance.
			self.balances.insert(from, from_balance - value);

			// Update the receiver's balance.
			let to_balance = self.balance_of_or_zero(&to);
			self.balances.insert(to, to_balance + value);

			self.env().emit_event(Transfer {
				from: Some(from),
				to: Some(to),
				value,
			});

			true
		}

		fn balance_of_or_zero(&self, owner: &AccountId) -> Balance {
			*self.balances.get(owner).unwrap_or(&0)
		}

		fn allowance_of_or_zero(&self, owner: &AccountId, spender: &AccountId) -> Balance {
			// ACTION: `get` the `allowances` of `(owner, spender)` and `unwrap_or` return `0`.
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
			contract.transfer_from(AccountId::from([0x1; 32]), AccountId::from([0x0; 32]), 10);
			assert_eq!(contract.balance_of(AccountId::from([0x0; 32])), 10);
		}
	}
}
