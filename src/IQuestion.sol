// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.6;

interface IQuestion {
    struct TestCase {
        bytes[] input;
        bytes output;
    }

    function getTestCases() external view returns (TestCase[] memory);

    function setWinnerShare(uint256 _winnerShare) external;
}
