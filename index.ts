import { RulesEngine, processPolicy } from "@thrackle-io/forte-rules-engine-sdk";
import * as fs from "fs";
import { getConfig, connectConfig } from "@thrackle-io/forte-rules-engine-sdk/config";
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

async function injectModifiers(policyJSONFile: string, sourceContractFile: string) {
  // Create modifiers and inject them into the contract
  // const modifiers = await RULES_ENGINE.createModifiers(policyId, sourceContractFile, destinationModifierFile);
  // console.log("Modifiers created: ", modifiers); // TODO does this return anything?
  // console.log("Modifiers created: ", modifiers); // TODO does this return anything?
  processPolicy(policyJSONFile, [sourceContractFile]);
}

async function applyPolicy(policyId: number, callingContractAddress: Address) {
  validatePolicyId(policyId);

  // Apply the policy to the contract
  const result = await RULES_ENGINE.applyPolicy(policyId, callingContractAddress);
  console.log("Policy applied. Result: ", result);
}

// Test a transaction to show the policy is not applied (expected success+failure cases)
async function testTransaction() {
  // Test a transaction to show the policy is not applied
  // await simulateContract(config, {
  //   address: RULES_ENGINE.address,
  //   abi: RULES_ENGINE.abi,
  //   functionName: "applyPolicy",
  //   args: [contractAddressForPolicy, [policyId]],
  // });
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
    // injectModifiers - npx injectModifiers <policyJSONFilePath> <sourceContractFile>
    const policyJSONFilePath = process.argv[3] || "policy.json";
    const sourceContractFile = process.argv[4] || "src/ExampleContract.sol";
    await injectModifiers(policyJSONFilePath, sourceContractFile);
  } else if (process.argv[2] == "applyPolicy") {
    // applyPolicy - npx applyPolicy <policyId> <address>
    const policyId = Number(process.argv[3]);
    validatePolicyId(policyId);
    const callingContractAddress = getAddress(process.argv[4]);
    await applyPolicy(policyId, callingContractAddress);
  } else if (process.argv[2] == "simulateTx") {
    // THIS MAY NOT BE A GREAT IDEA
    // testTransaction - npx simulateTx <callingContractAddress> <functionSignature> <args> <privKey>
    const callingContractAddress = getAddress(process.argv[3]);
    const functionSignature = process.argv[4] || "transfer(address,uint256)";
    const args = process.argv[5] || "0x70997970C51812dc3A010C7d01b50e0d17dc79C8 9999";
    const privateKey = process.argv[6];

    // Run the test transaction

    await testTransaction();
  } else {
    console.log("Invalid command. Please use one of the following commands:");
    console.log("     setupPolicy <OPTIONAL: policyJSONFilePath>");
    console.log("     injectModifiers <policyId> <sourceContractFile> <destinationModifierFile>");
    console.log("     applyPolicy <policyId> <address>");
    console.log("     simulateTx <callingContractAddress> <functionSignature> <args> <privKey>");
  }
}

main();
