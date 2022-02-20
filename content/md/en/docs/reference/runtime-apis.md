Substrate ships with the following runtime APIs:

- [`BlockBuilder`](/rustdocs/latest/sp_block_builder/trait.BlockBuilder.html): Provides the functionality required for building a block.
- [`TaggedTransactionQueue`](/rustdocs/latest/sp_transaction_pool/runtime_api/trait.TaggedTransactionQueue.html): Handles validating transactions in the transaction queue.
- [`OffchainWorkerApi`](/rustdocs/latest/sp_offchain/trait.OffchainWorkerApi.html): Handles [off-chain capabilities](/v3/concepts/off-chain-features).
- [`AuraApi`](/rustdocs/latest/sp_consensus_aura/trait.AuraApi.html): Handles block authorship with [Aura consensus](/v3/advanced/consensus#aura).
- [`SessionKeys`](/rustdocs/latest/sp_session/trait.SessionKeys.html): Generates and decodes [session keys](/v3/concepts/session-keys).
- [`GrandpaApi`](/rustdocs/latest/sp_finality_grandpa/trait.GrandpaApi.html): Integrates the [GRANDPA](/v3/advanced/consensus#grandpa) finality gadget into the runtime.
- [`AccountNonceApi`](/rustdocs/latest/frame_system_rpc_runtime_api/trait.AccountNonceApi.html): Handles querying transaction indices.
- [`TransactionPaymentApi`](/rustdocs/latest/pallet_transaction_payment_rpc_runtime_api/trait.TransactionPaymentApi.html): Handles querying information about transactions.
- [`Benchmark`](/rustdocs/latest/frame_benchmarking/trait.Benchmark.html): Provides a way to [benchmark](/v3/runtime/benchmarking) a FRAME runtime.

 ## Learn more 
 
 - How to design your custom runtime APIs using the [`impl_runtime_apis`](/rustdocs/latest/sp_api/macro.impl_runtime_apis.html) macro