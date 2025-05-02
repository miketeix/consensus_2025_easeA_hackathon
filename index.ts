import { RulesEngine, policyModifierGeneration } from "@thrackle-io/forte-rules-engine-sdk";
import * as fs from "fs";
import { getConfig, connectConfig, ruleJSON } from "@thrackle-io/forte-rules-engine-sdk/config";
import { Address, getAddress } from "viem";
import { simulateContract } from "@wagmi/core";

// Hardcoded address of the diamond in diamondDeployedAnvilState.json
const RULES_ENGINE_ADDRESS: Address = getAddress(`0x0165878A594ca255338adfa4d48449f69242Eb8F`);
const config = getConfig();
const client = config.getClient({ chainId: config.chains[0].id });
const RULES_ENGINE = new RulesEngine(RULES_ENGINE_ADDRESS, client);

async function setupPolicy(policyData: string): Promise<number> {
  // Create a new policy
  const policyId: number = await RULES_ENGINE.createPolicy(policyData);
  console.log(`Policy \'${policyId}\' created successfully.`);
  return policyId;
}

async function injectModifiers(policyJSONFile: string, modifierFileName: string, sourceContractFile: string) {
  policyModifierGeneration(policyJSONFile, modifierFileName, [sourceContractFile]);
}

async function applyPolicy(policyId: number, callingContractAddress: Address) {
  validatePolicyId(policyId);

  // Apply the policy to the contract
  const result = await RULES_ENGINE.applyPolicy(policyId, callingContractAddress);
  console.log("Policy applied. Result: ", result);
}

function validatePolicyId(policyId: number): boolean {
  // Check if the policy ID is a valid number
  if (isNaN(policyId) || policyId <= 0) {
    throw new Error(`Invalid policy ID: ${policyId}. The policy ID must be a number greater than 0.`);
  }
  // Check if the policy ID is valid
  // const policy = RULES_ENGINE.getPolicy(policyId);
  // if (!policy) {
  //   // TODO update this check
  //   throw new Error(`Policy ID ${policyId} does not exist.`);
  // }
  return true;
}

async function main() {
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
    validatePolicyId(policyId);
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
