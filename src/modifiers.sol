// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "/Users/dmulvi/projects/thrackle/rules-v2/forte-rules-engine/src/client/RulesEngineClient.sol";

/**
 * @title Rules Engine Client Custom Modifiers
 */
abstract contract RulesEngineClientCustom is RulesEngineClient {
    modifier checkRulesBefore(address to, uint256 value) {
        bytes memory encoded = abi.encodeWithSelector(
            msg.sig,
            to,
            value,
            msg.sender
        );
        _invokeRulesEngine(encoded);
        _;
    }

    modifier checkRulesAfter(address to, uint256 value) {
        bytes memory encoded = abi.encodeWithSelector(
            msg.sig,
            to,
            value,
            msg.sender
        );
        _;
        _invokeRulesEngine(encoded);
    }
}
