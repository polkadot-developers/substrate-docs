# Build Spec
./target/release/polkadot build-spec --chain rococo-local --disable-default-bootnode > rococo-custom-2-plain.json
./target/release/polkadot build-spec --chain rococo-custom-2-plain.json --raw --disable-default-bootnode > rococo-custom-2-raw.json

# modify from snipets to copy and make 3 & 4 validator plain specs

./target/release/polkadot build-spec --chain rococo-custom-3-plain.json --raw --disable-default-bootnode > rococo-custom-3-raw.json
./target/release/polkadot build-spec --chain rococo-custom-4-plain.json --raw --disable-default-bootnode > rococo-custom-4-raw.json

# Clear old DBs

rm -rf /tmp/relay /tmp/parachain

# Relay Validators with 2 validator chainspec
./target/release/polkadot --alice --validator --base-path /tmp/relay/alice --chain ../cumulus-workshop/shared/chainspecs/rococo-custom-2-raw.json --port 30333 --ws-port 9944

./target/release/polkadot --bob --validator --base-path /tmp/relay/bob --chain ../cumulus-workshop/shared/chainspecs/rococo-custom-2-raw.json --port 30334 --ws-port 9945

# ./target/release/polkadot --charlie --validator --base-path /tmp/relay/charlie --chain ../cumulus-workshop/shared/chainspecs/rococo-custom-2-raw.json --port 30335 --ws-port 9946

# Register paraID 2000 with `Charlie`
# https://polkadot.js.org/apps/?rpc=ws%3A%2F%2F127.0.0.1%3A9944#/parachains/parathreads

# Parachain collators gen state
./target/release/parachain-collator export-genesis-state --parachain-id 2000 > para-2000-genesis
# Parachain collators gen wasm
./target/release/parachain-collator export-genesis-wasm > para-2000-wasm

# Submit (as sudo) parasSudoWrapper -> sudoScheduleParaInitialize(id, genesis) for parachain 2000
# https://polkadot.js.org/apps/?rpc=ws%3A%2F%2F127.0.0.1%3A9944#/sudo
# Parachain = Yes (true)

# Parachain collator launch
./target/release/parachain-collator --alice --collator --force-authoring --parachain-id 2000 --base-path /tmp/parachain/alice --port 40333 --ws-port 8844 -- --execution wasm --chain ../cumulus-workshop/shared/chainspecs/rococo-custom-2-raw.json --port 30343 --ws-port 9977

# Force que action to speed up (as sudo): paras -> forceQueueAction(para) for 2000
# https://polkadot.js.org/apps/?rpc=ws%3A%2F%2F127.0.0.1%3A9944#/sudo