// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.6;

abstract contract Answer {
    address payable public owner;

    constructor() {
        owner = payable(msg.sender);
    }
}
