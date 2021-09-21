# Relay Validators
./target/release/polkadot --alice --validator --base-path /tmp/relay/alice --chain ../cumulus-workshop/shared/chainspecs/rococo-custom.json --port 30333 --ws-port 9944

./target/release/polkadot --bob --validator --base-path /tmp/relay/bob --chain ../cumulus-workshop/shared/chainspecs/rococo-custom.json --port 30334 --ws-port 9945

# ./target/release/polkadot --charlie --validator --base-path /tmp/relay/charlie --chain ../cumulus-workshop/shared/chainspecs/rococo-custom.json --port 30335 --ws-port 9946


# Parachain collators:
./target/release/parachain-collator --alice --collator --force-authoring --parachain-id 2000 --base-path /tmp/parachain/alice --port 40333 --ws-port 8844 -- --execution wasm --chain ../cumulus-workshop/shared/chainspecs/rococo-custom.json --port 30343 --ws-port 9977
