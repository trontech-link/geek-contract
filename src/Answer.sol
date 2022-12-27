// This contract should be created and deployed by the participant. Below is just an example.
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.6;

import "./IAnswer.sol";

contract Answer is IAnswer {
    address payable public owner;

    constructor() {
        owner = payable(msg.sender);
    }

    function main(bytes[] memory input)
        public
        pure
        override
        returns (bytes[] memory)
    {
        bytes[] memory output = new bytes[](2);
        output[0] = input[1];
        output[1] = input[0];
        return output;
    }
}
