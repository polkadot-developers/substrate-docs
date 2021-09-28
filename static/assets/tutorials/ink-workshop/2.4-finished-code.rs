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
		allowances: ink_storage::collections::HashMap<(AccountId, AccountId), Balance>,
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

	#[ink(event)]
	pub struct Approval {
		#[ink(topic)]
		owner: AccountId,
		#[ink(topic)]
		spender: AccountId,
		#[ink(topic)]
		value: Balance,
	}

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
					balances,
					allowances: ink_storage::collections::HashMap::new(),
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
			// Record the new allowance.
			let owner = self.env().caller();
			self.allowances.insert((owner, spender), value);

			// Notify offchain users of the approval and report success.
			self.env().emit_event(Approval {
				owner,
				spender,
				value,
			});
			true
		}

		#[ink(message)]
		pub fn allowance(&self, owner: AccountId, spender: AccountId) -> Balance {
			self.allowance_of_or_zero(&owner, &spender)
		}

		#[ink(message)]
		pub fn transfer_from(&mut self, from: AccountId, to: AccountId, value: Balance) -> bool {
			// Ensure that a sufficient allowance exists.
			let caller = self.env().caller();
			let allowance = self.allowance_of_or_zero(&from, &caller);
			if allowance < value {
				return false;
			}

			let transfer_result = self.transfer_from_to(from, to, value);
			// Check `transfer_result` because `from` account may not have enough balance
			//   and return false.
			if !transfer_result {
				return false
			}

			// Decrease the value of the allowance and transfer the tokens.
			self.allowances.insert((from, caller), allowance - value);
			true
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
			// If you are new to Rust, you may wonder what's the deal with all the asterisks and
			// ampersends.
			//
			// In brief, using `&` if we want to get the address of a value (aka reference of the
			// value), and using `*` if we have the reference of a value and want to get the value
			// back (aka dereferencing).
			// To read more: https://doc.rust-lang.org/book/ch04-02-references-and-borrowing.html
			*self.allowances.get(&(*owner, *spender)).unwrap_or(&0)
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

		#[ink::test]
		fn allowances_works() {
			let mut contract = Erc20::new(100);
			assert_eq!(contract.balance_of(AccountId::from([0x1; 32])), 100);
			contract.approve(AccountId::from([0x1; 32]), 200);
			assert_eq!(contract.allowance(AccountId::from([0x1; 32]), AccountId::from([0x1; 32])), 200);

			assert!(contract.transfer_from(AccountId::from([0x1; 32]), AccountId::from([0x0; 32]), 50));
			assert_eq!(contract.balance_of(AccountId::from([0x0; 32])), 50);
			assert_eq!(contract.allowance(AccountId::from([0x1; 32]), AccountId::from([0x1; 32])), 150);

			assert!(!contract.transfer_from(AccountId::from([0x1; 32]), AccountId::from([0x0; 32]), 100));
			assert_eq!(contract.balance_of(AccountId::from([0x0; 32])), 50);
			assert_eq!(contract.allowance(AccountId::from([0x1; 32]), AccountId::from([0x1; 32])), 150);
		}
	}
}
