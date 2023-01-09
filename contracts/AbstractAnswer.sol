// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.6;

abstract contract AbstractAnswer {
    address payable public owner;

    constructor() {
        owner = payable(msg.sender);
    }
}
