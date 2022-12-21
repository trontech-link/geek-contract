// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.6;

interface IAnswer {
    function main(uint256 _input) external returns (uint256);
}
