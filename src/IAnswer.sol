// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.6;

interface IAnswer {
    function main(bytes[] memory input) external returns (bytes[] memory);
}
