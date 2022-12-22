// This contract should be created and deployed by the participant. Below is just an example.
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.6;

import "./IAnswer.sol";

contract WrongAnswer is IAnswer {
    address payable public owner;

    constructor() {
        owner = payable(msg.sender);
    }

    function main(bytes[] memory input)
        public
        pure
        override
        returns (bytes memory)
    {
        // uint256 sum = uint256(bytes32(input[0])) - uint256(bytes32(input[1]));
        return input[0];
    }
}
