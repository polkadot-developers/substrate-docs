#![cfg_attr(not(feature = "std"), no_std)]

pub use pallet::*;

#[frame_support::pallet]
pub mod pallet {
  use frame_support::pallet_prelude::*;
  use frame_system::pallet_prelude::*;
  use frame_support::{
    sp_runtime::traits::Hash,
    traits::{ Randomness, Currency, tokens::ExistenceRequirement },
    transactional
  };
  use sp_io::hashing::blake2_128;
  use scale_info::TypeInfo;

  #[cfg(feature = "std")]
  use frame_support::serde::{Deserialize, Serialize};

  type AccountOf<T> = <T as frame_system::Config>::AccountId;
  type BalanceOf<T> =
    <<T as Config>::Currency as Currency<<T as frame_system::Config>::AccountId>>::Balance;

  // Struct for holding Kitty information.
	#[derive(Clone, Encode, Decode, PartialEq, RuntimeDebug, TypeInfo)]
	#[scale_info(skip_type_params(T))]
  pub struct Kitty<T: Config> {
    pub dna: [u8; 16],   // Using 16 bytes to represent a kitty DNA
    pub price: Option<BalanceOf<T>>,
    pub gender: Gender,
    pub owner: AccountOf<T>,
  }

  // Set Gender type in Kitty struct.
	#[derive(Clone, Encode, Decode, PartialEq, RuntimeDebug, TypeInfo)]
	#[scale_info(skip_type_params(T))]
  #[cfg_attr(feature = "std", derive(Serialize, Deserialize))]
  pub enum Gender {
    Male,
    Female,
  }

  #[pallet::pallet]
  #[pallet::generate_store(pub(super) trait Store)]
  pub struct Pallet<T>(_);

  // Configure the pallet by specifying the parameters and types on which it depends.
  #[pallet::config]
  pub trait Config: frame_system::Config {
    /// Because this pallet emits events, it depends on the runtime's definition of an event.
    type Event: From<Event<Self>> + IsType<<Self as frame_system::Config>::Event>;

    /// The Currency handler for the Kitties pallet.
    type Currency: Currency<Self::AccountId>;

    /// The maximum amount of Kitties a single account can own.
    #[pallet::constant]
    type MaxKittyOwned: Get<u32>;

    /// The type of Randomness we want to specify for this pallet.
    type KittyRandomness: Randomness<Self::Hash, Self::BlockNumber>;
  }

  // Errors.
  #[pallet::error]
  pub enum Error<T> {
    /// Handles arithemtic overflow when incrementing the Kitty counter.
    KittyCntOverflow,
    /// An account cannot own more Kitties than `MaxKittyCount`.
    ExceedMaxKittyOwned,
    /// Buyer cannot be the owner.
    BuyerIsKittyOwner,
    /// Cannot transfer a kitty to its owner.
    TransferToSelf,
    /// Handles checking whether the Kitty exists.
    KittyNotExist,
    /// Handles checking that the Kitty is owned by the account transferring, buying or setting a price for it.
    NotKittyOwner,
    /// Ensures the Kitty is for sale.
    KittyNotForSale,
    /// Ensures that the buying price is greater than the asking price.
    KittyBidPriceTooLow,
    /// Ensures that an account has enough funds to purchase a Kitty.
    NotEnoughBalance,
  }

	// Events.
	#[pallet::event]
	#[pallet::generate_deposit(pub(super) fn deposit_event)]
	pub enum Event<T: Config> {
		/// A new Kitty was successfully created. \[sender, kitty_id\]
		Created(T::AccountId, T::Hash),
		/// Kitty price was successfully set. \[sender, kitty_id, new_price\]
		PriceSet(T::AccountId, T::Hash, Option<BalanceOf<T>>),
		/// A Kitty was successfully transferred. \[from, to, kitty_id\]
		Transferred(T::AccountId, T::AccountId, T::Hash),
		/// A Kitty was successfully bought. \[buyer, seller, kitty_id, bid_price\]
		Bought(T::AccountId, T::AccountId, T::Hash, BalanceOf<T>),
	}

  // Storage items.

  #[pallet::storage]
  #[pallet::getter(fn kitty_cnt)]
  /// Keeps track of the number of Kitties in existence.
  pub(super) type KittyCnt<T: Config> = StorageValue<_, u64, ValueQuery>;

  #[pallet::storage]
  #[pallet::getter(fn kitties)]
  /// Stores a Kitty's unique traits, owner and price.
  pub(super) type Kitties<T: Config> = StorageMap<_, Twox64Concat, T::Hash, Kitty<T>>;

  #[pallet::storage]
  #[pallet::getter(fn kitties_owned)]
  /// Keeps track of what accounts own what Kitty.
  pub(super) type KittiesOwned<T: Config> =
    StorageMap<_, Twox64Concat, T::AccountId, BoundedVec<T::Hash, T::MaxKittyOwned>, ValueQuery>;

  // ACTION #11: Our pallet's genesis configuration.

  #[pallet::call]
  impl<T: Config> Pallet<T> {
    /// Create a new unique kitty.
    ///
    /// The actual kitty creation is done in the `mint()` function.
    #[pallet::weight(100)]
    pub fn create_kitty(origin: OriginFor<T>) -> DispatchResult {
      let sender = ensure_signed(origin)?;

      let kitty_id = Self::mint(&sender, None, None)?;
      log::info!("A kitty is born with ID: {:?}.", kitty_id);
      Self::deposit_event(Event::Created(sender, kitty_id));
      Ok(())
    }

    /// Set the price for a Kitty.
    ///
    /// Updates Kitty price and updates storage.
    #[pallet::weight(100)]
    pub fn set_price(
      origin: OriginFor<T>,
      kitty_id: T::Hash,
      new_price: Option<BalanceOf<T>>
    ) -> DispatchResult {
      let sender = ensure_signed(origin)?;

      // ACTION #1a: Checking Kitty owner

      let mut kitty = Self::kitties(&kitty_id).ok_or(<Error<T>>::KittyNotExist)?;

      // ACTION #2: Set the Kitty price and update new Kitty infomation to storage.

      // ACTION #3: Deposit a "PriceSet" event.

      Ok(())
    }

    // ACTION #4: transfer

    // buy_kitty
    #[transactional]
    #[pallet::weight(100)]
    pub fn buy_kitty(
      origin: OriginFor<T>,
      kitty_id: T::Hash,
      bid_price: BalanceOf<T>
    ) -> DispatchResult {
      let buyer = ensure_signed(origin)?;

      // Check the kitty exists and buyer is not the current kitty owner
      let kitty = Self::kitties(&kitty_id).ok_or(<Error<T>>::KittyNotExist)?;
      ensure!(kitty.owner != buyer, <Error<T>>::BuyerIsKittyOwner);

      // ACTION #6: Check if the Kitty is for sale.

      // ACTION #7: Check if buyer can receive Kitty.

      // ACTION #8: Update Balances using the Currency trait.

      Ok(())
    }

    /// Breed a Kitty.
    ///
    /// Breed two kitties to create a new generation
    /// of Kitties.
    #[pallet::weight(100)]
    pub fn breed_kitty(
      origin: OriginFor<T>,
      parent1: T::Hash,
      parent2: T::Hash
    ) -> DispatchResult {
      let sender = ensure_signed(origin)?;

      // Check: Verify `sender` owns both kitties (and both kitties exist).
      ensure!(Self::is_kitty_owner(&parent1, &sender)?, <Error<T>>::NotKittyOwner);
      ensure!(Self::is_kitty_owner(&parent2, &sender)?, <Error<T>>::NotKittyOwner);

      // ACTION #9: Breed two Kitties using unique DNA

      // ACTION #10: Mint new Kitty using new DNA

      Ok(())
    }
  }

  //** Our helper functions.**//

  impl<T: Config> Pallet<T> {
    fn gen_gender() -> Gender {
      let random = T::KittyRandomness::random(&b"gender"[..]).0;
      match random.as_ref()[0] % 2 {
        0 => Gender::Male,
        _ => Gender::Female,
      }
    }

    fn gen_dna() -> [u8; 16] {
      let payload = (
        T::KittyRandomness::random(&b"dna"[..]).0,
        <frame_system::Pallet<T>>::extrinsic_index().unwrap_or_default(),
        <frame_system::Pallet<T>>::block_number(),
      );
      payload.using_encoded(blake2_128)
    }

    pub fn breed_dna(parent1: &T::Hash, parent2: &T::Hash) -> Result<[u8; 16], Error<T>> {
      let dna1 = Self::kitties(parent1).ok_or(<Error<T>>::KittyNotExist)?.dna;
      let dna2 = Self::kitties(parent2).ok_or(<Error<T>>::KittyNotExist)?.dna;

      let mut new_dna = Self::gen_dna();
      for i in 0..new_dna.len() {
        new_dna[i] = (new_dna[i] & dna1[i]) | (!new_dna[i] & dna2[i]);
      }
      Ok(new_dna)
    }

    // Helper to mint a Kitty.
    pub fn mint(
      owner: &T::AccountId,
      dna: Option<[u8; 16]>,
      gender: Option<Gender>,
    ) -> Result<T::Hash, Error<T>> {
      let kitty = Kitty::<T> {
        dna: dna.unwrap_or_else(Self::gen_dna),
        price: None,
        gender: gender.unwrap_or_else(Self::gen_gender),
        owner: owner.clone(),
      };

      let kitty_id = T::Hashing::hash_of(&kitty);

      // Performs this operation first as it may fail
      let new_cnt = Self::kitty_cnt().checked_add(1)
        .ok_or(<Error<T>>::KittyCntOverflow)?;

      // Performs this operation first because as it may fail
      <KittiesOwned<T>>::try_mutate(&owner, |kitty_vec| {
        kitty_vec.try_push(kitty_id)
      }).map_err(|_| <Error<T>>::ExceedMaxKittyOwned)?;

      <Kitties<T>>::insert(kitty_id, kitty);
      <KittyCnt<T>>::put(new_cnt);
      Ok(kitty_id)
    }

    // ACTION #1b

    // ACTION #5: Write transfer_kitty_to
  }
}
