import {
  getRulesEnginePolicyContract,
  getRulesEngineComponentContract,
  createFullPolicy,
  retrieveFullPolicy,
  //} from "@thrackle-io/forte-rules-engine-sdk";
} from "@thrackle-io/forte-rules-engine-sdk/src/index";
import { applyPolicy } from "@thrackle-io/forte-rules-engine-sdk/src/modules/ContractInteraction";

import { getConfig, connectConfig } from "./config";
import { getAddress } from "viem";

// Hardcoded address of the diamond in diamondDeployedAnvilState.json
const DiamondAddress: `0x${string}` = `0x0165878A594ca255338adfa4d48449f69242Eb8F`;

const config = getConfig();

const client = config.getClient({ chainId: config.chains[0].id });

const policyJSON = {
  Policy: "Test Policy",
  ForeignCalls: [
    {
      name: "testSig(address)",
      address: "0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e",
      signature: "testSig(address)",
      returnType: "uint256",
      parameterTypes: "address",
      encodedIndices: "0",
    },
  ],
  Trackers: [
    {
      name: "trackerOne",
      type: "uint256",
      defaultValue: 1,
    },
  ],
  RulesJSON: [
    {
      condition: "value > 10000",
      positiveEffects: ['revert("Passed test")'],
      negativeEffects: ['revert("Failed test")'],
      functionSignature: "transfer(address to, uint256 value)",
      encodedValues: "address to, uint256 value",
    },
  ],
};

async function main() {
  const rulesEngineContract: `0x${string}` = DiamondAddress;
  await connectConfig(config, 0);

  if (process.argv.length > 2) {
    const a = process.argv[2];
    const policyNum = Number(process.argv[3]);
    if (a == "apply") {
      const address = process.argv[4];
      var result = await applyPolicy(
        policyNum,
        getAddress(address),
        getRulesEnginePolicyContract(rulesEngineContract, client)
      );
      console.log("Policy applied");
    } else if (a == "poll") {
      var policy = await retrieveFullPolicy(
        policyNum,
        [
          {
            hex: "0xa9059cbb",
            functionSignature: "transfer(address to, uint256 value)",
          },
          { hex: "0x71308757", functionSignature: "testSig(address)" },
        ],
        getRulesEnginePolicyContract(rulesEngineContract, client),
        getRulesEngineComponentContract(rulesEngineContract, client)
      );
      console.log(policy);
    } else {
      console.log("parameter not supported");
    }
  } else {
    var result = await createFullPolicy(
      getRulesEnginePolicyContract(rulesEngineContract, client),
      getRulesEngineComponentContract(rulesEngineContract, client),
      JSON.stringify(policyJSON),
      "src/modifiers.sol",
      "src/ExampleContract.sol",
      1
    );
    console.log("Policy Id: ", result);
  }
}

main();
