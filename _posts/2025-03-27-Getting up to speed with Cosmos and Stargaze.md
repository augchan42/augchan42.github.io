---
layout: post
title: "Deploying a CosmWasm Smart Contract on the Stargaze Testnet"
author: "Aug"
date: 2025-03-27
header-style: text
catalog: true
description: "A developer's guide to deploying a CosmWasm smart contract on the Stargaze testnet, covering environment setup, starsd CLI usage, contract uploading, instantiation, and Rust version considerations."
tags:
  - rust
  - cosmwasm
  - smart contracts
  - starsd
  - cosmos
  - stargaze
  - testnet
---

**Abstract:**  
This post serves as a developer's guide to deploying a CosmWasm smart contract onto the Stargaze testnet. It covers essential steps including setting up the Stargaze CLI (`starsd`), configuring a wallet, obtaining testnet tokens, and managing Rust versions for compatibility. The guide also walks through uploading the contract, obtaining its code ID, and instantiating it on the testnet.

**Estimated reading time:** _15 minutes_

# Deploying a Smart Contract to Stargaze Testnet

## Introduction

Recently, I needed to deploy a smart contract to Stargaze. Here are some key things I learned:

- Stargaze is a Cosmos IBC Chain.
- I needed to deploy to the Stargaze testnet.
- The deployment process has two separate steps:
  1. Uploading the contract to the chain.
  2. Instantiating it (which is like a factory creating an instance).
- CosmWasm v2.2.2 is available, but I couldn't make it work with newer Rust versions. I had to use an older version, Rust 1.81.0.

The documentation is spread across different Cosmos and Stargaze resources. This meant I had to switch between them often.

## Setting Up the Environment

### Setting up the Stargaze CLI (`starsd`)

First, I needed to set up the Stargaze command-line interface (`starsd`):

```bash
# Clone the Stargaze repository
gh repo clone public-awesome/stargaze
```

> Note: Their `git clone` command did not work as shown in their documentation.

Next, I needed to configure the CLI to connect to the Stargaze testnet:

```bash
# Set the testnet chain ID
starsd config set client chain-id elgafar-1

# Set the RPC endpoint
starsd config set client node https://rpc.elgafar-1.stargaze-apis.com:443

# Check the configuration
starsd config view client
```

The output should be similar to this:

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

I imported my wallet using my BIP39 recovery phrase (mnemonic):

```bash
# Import your private key via the bip39 mnemonic
starsd keys add imported-wallet --recover

# Check it has been added to your keyring
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

The faucet gives 5 testnet STARS each time. It seems you can only request once per day.

### Setting Up Rust

Next, I needed the correct Rust version:

> **Important Note**: Rust compiler versions 1.82 and newer have a feature called "reference types" turned on by default. This causes compatibility problems. Even though CosmWasm v2.2.2 is available and should support reference types, I could not get it to work correctly. To compile and deploy my contracts successfully, I had to use an older Rust version, 1.81.0.

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

I used the `cw1_whitelist` contract:

```bash
cd contracts/cw1-whitelist && cargo wasm
```

If you encounter any issues, try running `cargo clean`, then `cargo update`, and finally `cargo wasm`.

Before uploading or instantiating a contract, I verified it with the compatibility check:

```bash
cosmwasm-check ../../target/wasm32-unknown-unknown/release/cw1_whitelist.wasm
```

## Uploading the Contract

The `store` command uploads the compiled WASM contract:

```bash
starsd tx wasm store cw1_whitelist.wasm \
  --from stars1t50gf5zarvpjh4h27epxydz5ewq5klw5mrtr8c \
  --gas-prices 0.025ustars \
  --gas-adjustment 1.7 \
  --gas auto
```

Save the transaction hash from this command's output; you will need it later to find the `code_id`.

## Getting the Contract Code ID

Using the transaction hash (from the `store` command output):

```bash
starsd q tx 0A1078B8364950CE7CE6F3992248662D9F1284676B912CEC2A64AA5176D63C64 -o json | jq '.. | select(.key? == "code_id")'
```

Output:

```bash
{
  "key": "code_id",
  "value": "5196",
  "index": true
}
```

After uploading, you can also get the `code_id` by querying the contract address:

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

The message needed to instantiate your smart contract depends on its specific initial settings. For this `cw1_whitelist` contract, for example, I needed to define the list of administrators.

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
