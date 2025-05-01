# Forte Rules Engine Quickstart (UNDER DEVELOPMENT)

This repository will guide you through using the Forte Rules Engine in a local [anvil](https://book.getfoundry.sh/anvil/) devlopment environement. Theis guide will go over:

1. Environment dependencies
2. Building
3. Configuring your environment
4. Starting a local Anvil instance
5. Creating a sample policy in the Rules Engine
6. Integrating the Rules Engine into a sample contract & deploying it locally
7. Applying the policy to the sample contract and verifying functionality

> **_NOTE:_** This guide was developed in a MacOS environment, some modification may be necessary to suit a Linux/Windows environment.

## Environment dependencies

This guide assumes the following tools are installed and configured correctly. Please see each tool's installation instructions for more details:

- [Git](https://git-scm.com/)
- [NodeJS](https://nodejs.org/)
- [Foundry](https://book.getfoundry.sh/getting-started/installation) (contains anvil/forge)

## Building

Clone this repository and navigate to the repository in your local shell. To build the repository, run the following commands:

```shell
npm install
forge install
```

## Configure your local environment
Set the following environment variables. 
```yaml
# local anvil RPC, change this if you're deploying to a network
RPC_URL=http://127.0.0.1:8545
# local anvil account private key, change to your deployer wallet key when using a live network
PRIV_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
# address of the rules engine within the anvil state file
RULES_ENGINE_ADDRESS=0x0165878A594ca255338adfa4d48449f69242Eb8F
```

## Start a local Anvil chain

```bash
anvil --load-state anvilState.json
```

### Setup Environment

```bash
source .env
```

### Create Policy on Rules Engine

```bash
npx tsx index.ts setupPolicy
```

### Deploy Example Contract

```bash
forge script script/ExampleContract.s.sol --ffi --broadcast -vvv --non-interactive --rpc-url $RPC_URL --private-key $PRIV_KEY
```

Note the contract address, add it to your `.env` file and re-run the source command:

```yaml
CONTRACT_ADDRESS=0xYourContractAddress
```

```
source .env
```

### Set Rules Engine Address

```bash
cast send $CONTRACT_ADDRESS "setRulesEngineAddress(address)" $RULES_ENGINE_ADDRESS --rpc-url $RPC_URL --private-key $PRIV_KEY
```

### Apply the Policy

```bash
npx tsx index.ts apply 1 $CONTRACT_ADDRESS
```

### Test Success Condition

```bash
cast send $CONTRACT_ADDRESS "transfer(address,uint256)" 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 10001 --rpc-url $RPC_URL --private-key $PRIV_KEY
```

You should receive a revert with the text "Passed Test"

### Test Failure Condition

```bash
cast send $CONTRACT_ADDRESS "transfer(address,uint256)" 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 9999 --rpc-url $RPC_URL --private-key $PRIV_KEY
```

You should receive a revert with the text "Failed Test"
