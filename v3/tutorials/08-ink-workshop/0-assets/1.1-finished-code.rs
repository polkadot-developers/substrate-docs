#![cfg_attr(not(feature = "std"), no_std)]

use ink_lang as ink;

#[ink::contract]
mod incrementer {
	#[ink(storage)]
	pub struct Incrementer {
		// Storage Declaration
	}

	impl Incrementer {
		#[ink(constructor)]
		pub fn new(init_value: i32) -> Self {
			// Contract Constructor
			Self{}
		}

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
			// Test Your Contract
		}
	}
}
