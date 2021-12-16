# Build Spec
./target/release/polkadot build-spec --chain rococo-local --disable-default-bootnode > rococo-custom-2-plain.json
./target/release/polkadot build-spec --chain rococo-custom-2-plain.json --raw --disable-default-bootnode > rococo-custom-2-raw.json

# modify from snipets to copy and make 3 & 4 validator plain specs

./target/release/polkadot build-spec --chain rococo-custom-3-plain.json --raw --disable-default-bootnode > rococo-custom-3-raw.json
./target/release/polkadot build-spec --chain rococo-custom-4-plain.json --raw --disable-default-bootnode > rococo-custom-4-raw.json

# Clear old DBs

rm -rf /tmp/relay /tmp/parachain

# Relay Validators with 2 validator chain spec
./target/release/polkadot --alice --validator --base-path /tmp/relay/alice --chain ../substrate-docs/static/assets/tutorials/cumulus/chain-specs/rococo-custom-2-raw.json --port 30333 --ws-port 9944

./target/release/polkadot --bob --validator --base-path /tmp/relay/bob --chain ../substrate-docs/static/assets/tutorials/cumulus/chain-specs/rococo-custom-2-raw.json --port 30334 --ws-port 9945

# ./target/release/polkadot --charlie --validator --base-path /tmp/relay/charlie --chain ../substrate-docs/static/assets/tutorials/cumulus/chain-specs/rococo-custom-2-raw.json --port 30335 --ws-port 9946

# Register para ID 2000 with `Charlie`
# https://polkadot.js.org/apps/?rpc=ws%3A%2F%2F127.0.0.1%3A9944#/parachains/parathreads

# Create parachain spec
./target/release/parachain-collator build-spec --disable-default-bootnode > rococo-local-parachain-plain.json

# modify specs (if needed) to get the right paraID (2000) and anything else
#   "para_id": 2000,
#         "parachainId": 2000
# really inspect plain is as expected before:

./target/release/parachain-collator build-spec --chain rococo-local-parachain-plain.json --raw --disable-default-bootnode > rococo-local-parachain-2000-raw.json

# Parachain collators gen state for correct chain spec with right paraID included
./target/release/parachain-collator export-genesis-state --chain rococo-local-parachain-2000-raw.json > para-2000-genesis

# Parachain collators gen wasm for correct chain spec with right paraID included
./target/release/parachain-collator export-genesis-wasm --chain rococo-local-parachain-2000-raw.json > para-2000-wasm

# Register parathread that charlie reserved (2000)

# Parachain collator launch
./target/release/parachain-collator --alice --collator --force-authoring --chain rococo-local-parachain-2000-raw.json --base-path /tmp/parachain/alice --port 40333 --ws-port 8844 -- --execution wasm --chain ../substrate-docs/static/assets/tutorials/cumulus/chain-specs/rococo-custom-2-raw.json --port 30343 --ws-port 9977

# Submit (as sudo) parasSudoWrapper -> sudoScheduleParaInitialize(id, genesis) for parachain 2000
# https://polkadot.js.org/apps/?rpc=ws%3A%2F%2F127.0.0.1%3A9944#/sudo
# Parachain = Yes (true)

# Optional Force que action to speed up (as sudo): paras -> forceQueueAction(para) for 2000
# https://polkadot.js.org/apps/?rpc=ws%3A%2F%2F127.0.0.1%3A9944#/sudo

# Test parachain transfer
# https://polkadot.js.org/apps/?rpc=ws%3A%2F%2F127.0.0.1%3A8844#/
