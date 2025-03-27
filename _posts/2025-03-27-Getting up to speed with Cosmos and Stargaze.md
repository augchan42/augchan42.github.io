---
layout:       post
title:        "Getting up to speed with Cosmos and Stargaze"
author:       "Aug"
header-style: text
catalog:      true
tags:
    - rust / rustc
    - smart contracts
    - starsd
    - cosmos
    - stargaze
---

# Deploying a Smart Contract to Stargaze Testnet

## Introduction

Recently, I was tasked with deploying a smart contract to Stargaze. Here's what I discovered along the way:

- Stargaze is a Cosmos IBC Chain
- I needed to deploy to Stargaze testnet
- The deployment process has two distinct steps:
  1. Uploading the contract to the chain
  2. Instantiating it (factory concept)
- Even though CosmWasm v2.2.2 is available, I still couldn't get it working with newer Rust versions and had to downgrade to Rust 1.81.0

The documentation is somewhat scattered between Cosmos and Stargaze resources, requiring back-and-forth reference between them.

## Setting Up the Environment

### Getting the Stargaze CLI Working

First, I needed to set up the Stargaze CLI (`starsd`):

```bash
# Clone the Stargaze repository
gh repo clone public-awesome/stargaze
```

> Note: Their git clone command didn't work as documented.

Next, I needed to configure the CLI to connect to the Stargaze testnet:

```bash
# Set the testnet chain ID
starsd config set client chain-id elgafar-1

# Set the RPC endpoint
starsd config set client node https://rpc.elgafar-1.stargaze-apis.com:443

# Confirm the configuration
starsd config view client
```

This should output something like this:

```toml
# This is a TOML config file.
# For more information, see https://github.com/toml-lang/toml

###############################################################################
###                           Client Configuration                            ###
###############################################################################

# The network chain ID
chain-id = "elgafar-1"

# The keyring's backend, where the keys are stored (os|file|kwallet|pass|test|memory)
keyring-backend = "os"

# CLI output format (text|json)
output = "text"

# <host>:<port> to CometBFT RPC interface for this chain
node = "https://rpc.elgafar-1.stargaze-apis.com:443"

# Transaction broadcasting mode (sync|async)
broadcast-mode = "sync"
```

### Setting Up a Wallet

I imported my wallet using a BIP39 mnemonic:

```bash
# Import your private key via the bip39 mnemonic
starsd keys add imported-wallet --recover

# Confirm it's been added to your keyring
starsd keys list
```

Example output:

```text
Enter keyring passphrase (attempt 1/3):
- address: stars1t50gf5zarvpjh4h27epxydz5ewq5klw5mrtr8c
  name: imported-wallet
  pubkey: '{"@type":"/cosmos.crypto.secp256k1.PubKey","key":"An9Ykmdeu9Kn/PGGnoe+d/vnpCX1LDqygPdMgAgzS979"}'
  type: local
```

### Getting Testnet Starz

You can get testnet STARS from the faucet at: https://testnet.ping.pub/stargaze/faucet

The faucet provides 5 testnet STARS at a time and appears to be limited to one request per day.

### Setting Up Rust

Next, I needed the correct Rust version:

> **Important Note**: Due to reference types feature enabled by default in the Rust compiler since version `1.82`, compatibility issues arise. Even though CosmWasm v2.2.2 is available and supposedly supports reference types, I still couldn't get it working properly. I had to downgrade to Rust 1.81.0 to successfully compile and deploy my contracts.

```bash
# Install Rust 1.81.0
rustup install 1.81.0

# Set it as the default
rustup default 1.81.0

# Add the wasm target for this specific version
rustup target add wasm32-unknown-unknown --toolchain 1.81.0
```

### Verifying the Installation

```bash
# Check current Rust version
rustc --version  # Should show 1.81.0

# Check available targets
rustup target list --installed  # Should include wasm32-unknown-unknown
```

## Contract Verification

Clone the cw-plus contracts:

```bash
gh repo clone CosmWasm/cw-plus
```

I used the cw1_whitelist contract:

```bash
cd contracts/cw1-whitelist && cargo wasm
```

If any issues, do `cargo clean`/`cargo update`/`cargo wasm` in that order.

Before attempting to upload or instantiate a contract, I made sure it passed the compatibility check:

```bash
cosmwasm-check ../../target/wasm32-unknown-unknown/release/cw1_whitelist.wasm
```

## Uploading the Contract

This command uploads the compiled WASM contract:

```bash
starsd tx wasm store cw1_whitelist.wasm \
  --from stars1t50gf5zarvpjh4h27epxydz5ewq5klw5mrtr8c \
  --gas-prices 0.025ustars \
  --gas-adjustment 1.7 \
  --gas auto
```
It's best to get the transaction hash from this command and then looking it up to get the code_id (in my case, its 5196).  

```
starsd q tx 0A1078B8364950CE7CE6F3992248662D9F1284676B912CEC2A64AA5176D63C64 | grep 'key: code_id' -A 1 | grep value | awk -F'"' '{print $2}'
5196
```

## Getting the Contract Code ID

After uploading, I needed to check the contract details to get its `code_id`:

```bash
starsd query wasm contract stars1cq7f2fkv5glhc94r62utemftx6y87cxudl0zvkcr3va9tj8n3mss9xlg3m
```

Output:

```yaml
address: stars1cq7f2fkv5glhc94r62utemftx6y87cxudl0zvkcr3va9tj8n3mss9xlg3m
contract_info:
  admin: stars1t50gf5zarvpjh4h27epxydz5ewq5klw5mrtr8c
  code_id: "5196"
  created:
    block_height: "15822799"
    tx_index: "0"
  creator: stars1t50gf5zarvpjh4h27epxydz5ewq5klw5mrtr8c
  extension: null
  ibc_port_id: ""
  label: StargazeContract
```

## Instantiating the Contract

The instantiate message depends on your smart contract's initial parameters. For the `cw1_whitelist` contract, I needed to set the admins list.

First, I checked the contract's `msg.rs` file to identify the expected parameters:

```rust
pub struct InstantiateMsg {
    pub admins: Vec<String>,
    pub mutable: bool,
}
```

Then I prepared the instantiation message:

```bash
INSTANTIATE_MSG='{"admins": ["stars1t50gf5zarvpjh4h27epxydz5ewq5klw5mrtr8c"], "mutable": true}'
```

And instantiated the contract:

```bash
starsd tx wasm instantiate 5196 "$INSTANTIATE_MSG" \
  --label "StargazeContract" \
  --admin stars1t50gf5zarvpjh4h27epxydz5ewq5klw5mrtr8c \
  --from imported-wallet \
  --amount "1000000ustars" \
  --gas-prices 0.025ustars \
  --gas-adjustment 1.7 \
  --gas auto
```

## Verifying Contract Deployment

### Checking Contract Info

```bash
starsd query wasm contract stars1cq7f2fkv5glhc94r62utemftx6y87cxudl0zvkcr3va9tj8n3mss9xlg3m
```

### Querying Contract State (Admins List)

```bash
starsd query wasm contract-state smart stars1cq7f2fkv5glhc94r62utemftx6y87cxudl0zvkcr3va9tj8n3mss9xlg3m '{"admin_list":{}}'
```

Output:

```yaml
address: stars1cq7f2fkv5glhc94r62utemftx6y87cxudl0zvkcr3va9tj8n3mss9xlg3m
contract_info:
  admin: stars1t50gf5zarvpjh4h27epxydz5ewq5klw5mrtr8c
  code_id: "5196"
  created:
    block_height: "15822799"
    tx_index: "0"
  creator: stars1t50gf5zarvpjh4h27epxydz5ewq5klw5mrtr8c
  extension: null
  ibc_port_id: ""
  label: StargazeContract
data:
  admins:
  - stars1t50gf5zarvpjh4h27epxydz5ewq5klw5mrtr8c
  mutable: true
```
# Executing a function in the Smart Contract

This will withdraw 0.5 STAR to the to_address (in this case the admin account)

```bash
starsd tx wasm execute stars1cq7f2fkv5glhc94r62utemftx6y87cxudl0zvkcr3va9tj8n3mss9xlg3m \
'{"execute": {"msgs": [{
    "bank": {
        "send": {
            "to_address": "stars1t50gf5zarvpjh4h27epxydz5ewq5klw5mrtr8c", 
            "amount": [{"denom": "ustars", "amount": "500000"}]
        }
    }
}]}}' \
--from imported-wallet \
--gas-prices 0.025ustars \
--gas-adjustment 1.7 \
--gas auto
```

## Confirm the updated balance

```bash
starsd query bank balances stars1cq7f2fkv5glhc94r62utemftx6y87cxudl0zvkcr3va9tj8n3mss9xlg3m
balances:
- amount: "500000"
  denom: ustars
pagination:
  total: "1"
```

## Tips for Analyzing a Standard CosmWasm Contract

When analyzing a standard CosmWasm contract, I typically look at the files in this order:

1. **msg.rs** - First, because it defines the contract's interface:
   - Contains the `InstantiateMsg`, `ExecuteMsg`, and `QueryMsg` structs
   - Shows what actions the contract can perform
   - Gives you a high-level overview of the contract's capabilities

2. **state.rs** - Second, because it defines the contract's data model:
   - Contains the contract's storage schema
   - Shows what data structures are being stored
   - Defines key-value store configurations

3. **contract.rs** - Third, as it contains the main business logic:
   - Has the core instantiate/execute/query entry points
   - Contains the actual implementation of contract functions
   - Shows how the contract processes messages and manages state

4. **error.rs** - Fourth, to understand error handling:
   - Defines custom error types
   - Shows what can go wrong
   - Helps understand validation and error cases

5. **lib.rs** - Fifth, as it's the entry point but usually just re-exports:
   - Shows module organization
   - Contains crate-level attributes and configurations
   - Links all the components together

6. **integration_tests.rs** - Last, to understand how it all works together:
   - Contains end-to-end tests
   - Shows real-world usage examples
   - Demonstrates expected behaviors

7. **bin/schema.rs** (in bin directory) - Reference as needed:
   - Generates JSON schema for messages
   - Useful for client integration

This order helps build understanding from the interface level down to implementation details. The message definitions (`msg.rs`) and state management (`state.rs`) give you the big picture before diving into the implementation details in `contract.rs`.

# Macro expansion

The tip https://cosmwasm.cosmos.network/tutorial/setup-environment is slightly wrong.

In vscode/cursor, you need to install the rust-analyzer extension.
Then bring up the ctrl-shift-P menu to select the 'rust analyzer: Expand macro recursively' option.


## Useful Links

- [CosmWasm Environment Setup](https://cosmwasm.cosmos.network/tutorial/setup-environment)
- [Stargaze Smart Contracts Documentation](https://docs.stargaze.zone/developers/cosmwasm-smart-contracts/testnet)