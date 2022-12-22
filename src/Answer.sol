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
        returns (bytes memory)
    {
        uint256 sum = uint256(bytes32(input[0])) + uint256(bytes32(input[1]));
        return abi.encodePacked(sum);
    }
}
