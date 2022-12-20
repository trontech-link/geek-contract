// This contract should be created and deployed by the participant. Below is just an example.
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.6;

contract Answer {
    address payable public owner;

    constructor() {
        owner = payable(msg.sender);
    }

    function main(uint256 _input) public pure returns (uint256) {
        return _input * 2;
    }
}
