import { RulesEngine, policyModifierGeneration } from "@thrackle-io/forte-rules-engine-sdk";
import * as fs from "fs";
import { connectConfig } from "@thrackle-io/forte-rules-engine-sdk/config";
import { Address, createTestClient, getAddress, http, PrivateKeyAccount, publicActions, walletActions } from "viem";
import { privateKeyToAccount } from 'viem/accounts'
import { Config, createConfig, mock, simulateContract } from "@wagmi/core";
import { foundry } from "@wagmi/core/chains";

// Hardcoded address of the diamond in diamondDeployedAnvilState.json
const RULES_ENGINE_ADDRESS: Address = getAddress(`0x0165878A594ca255338adfa4d48449f69242Eb8F`);
var config: Config
var RULES_ENGINE: RulesEngine

/**  
 * The following address and private key are defaults from anvil and are only meant to be used in a test environment.
 */
//-------------------------------------------------------------------------------------------------------------
const foundryPrivateKey: `0x${string}` = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
export const account: PrivateKeyAccount = privateKeyToAccount(foundryPrivateKey)
const foundryAccountAddress: `0x${string}` = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
export const DiamondAddress: `0x${string}` = `0x0165878A594ca255338adfa4d48449f69242Eb8F`
//-------------------------------------------------------------------------------------------------------------

/**
 * Creates a connection to the local anvil instance.
 * Separate configs will need to be created to communicate with different chains
 */
const createTestConfig = async() => {
  config = createConfig({
      chains: [foundry],
      client({ chain }) { 
        return createTestClient(
          { 
            chain,
            transport: http('http://127.0.0.1:8545'),
            mode: 'anvil',
            account
          }
        ).extend(walletActions).extend(publicActions)
      }, 
      connectors: [
          mock({
              accounts: [
                foundryAccountAddress
              ]
          })
      ]
  })
}

async function setupPolicy(policyData: string): Promise<number> {
  // Create a new policy
  const result = await RULES_ENGINE.createPolicy(policyData);
  console.log(`Policy \'${result.policyId}\' created successfully.`);
  return result.policyId;
}

async function injectModifiers(policyJSONFile: string, modifierFileName: string, sourceContractFile: string) {
  policyModifierGeneration(policyJSONFile, modifierFileName, [sourceContractFile]);
}

async function applyPolicy(policyId: number, callingContractAddress: Address) {
  await validatePolicyId(policyId);

  // Apply the policy to the contract
  const result = await RULES_ENGINE.applyPolicy(policyId, callingContractAddress);
  console.log("Policy applied. Result: ", result);
}

async function validatePolicyId(policyId: number): Promise<boolean> {
  // Check if the policy ID is a valid number
  if (isNaN(policyId) || policyId <= 0) {
    throw new Error(`Invalid policy ID: ${policyId}. The policy ID must be a number greater than 0.`);
  }
  // Check if the policy ID is valid
  const policy = await RULES_ENGINE.policyExists(policyId)
  if (!policy) {
    // TODO update this check
    throw new Error(`Policy ID ${policyId} does not exist.`);
  }
  return true;
}

async function main() {
  await createTestConfig()
  var client = config.getClient({ chainId: config.chains[0].id });
  RULES_ENGINE = new RulesEngine(RULES_ENGINE_ADDRESS, config, client);
  await connectConfig(config, 0);
  // Assuming a syntax of npx <run command> <args>
  if (process.argv[2] == "setupPolicy") {
    // setupPolicy - npx setupPolicy <OPTIONAL: policyJSONFilePath>
    var policyJSONFile = process.argv[3];
    if (!policyJSONFile) {
      policyJSONFile = "policy.json";
    }
    let policyData: string = fs.readFileSync(policyJSONFile, "utf8");
    if (!policyData) {
      console.error(`Policy JSON file ${policyJSONFile} does not exist.`);
      return;
    }
    await setupPolicy(policyData);
  } else if (process.argv[2] == "injectModifiers") {
    // injectModifiers - npx injectModifiers <policyJSONFilePath> <newModifierFileName> <sourceContractFile>
    // npx tsx index.ts injectModifiers policy.json src/RulesEngineIntegration src/ExampleContract.sol
    const policyJSONFile = process.argv[3] || "policy.json";
    const newModifierFileName = process.argv[4] || "src/RulesEngineIntegration.sol";
    const sourceContractFile = process.argv[5] || "src/ExampleContract.sol";
    await injectModifiers(policyJSONFile, newModifierFileName, sourceContractFile);
  } else if (process.argv[2] == "applyPolicy") {
    // applyPolicy - npx applyPolicy <policyId> <address>
    const policyId = Number(process.argv[3]);
    await validatePolicyId(policyId);
    const callingContractAddress = getAddress(process.argv[4]);
    await applyPolicy(policyId, callingContractAddress);
  } else {
    console.log("Invalid command. Please use one of the following commands:");
    console.log("     setupPolicy <OPTIONAL: policyJSONFilePath>");
    console.log("     injectModifiers <policyId> <sourceContractFile> <destinationModifierFile>");
    console.log("     applyPolicy <policyId> <address>");
  }
}

main();
