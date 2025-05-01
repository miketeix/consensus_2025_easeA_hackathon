// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "./RulesEngineClientCustom.sol";

/**
 * @title Rules Engine Client Custom Modifiers
 */
contract ExampleContract is RulesEngineClientCustom {
    function transfer(address to, uint256 value) public checkRulesBefore(to, value) {
        // this function is purposefully empty
    }
}
