// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.6;

interface IQuestion {
    struct TestCase {
        uint256 input;
        uint256 output;
    }

    function setDescription(string memory _description) external;

    function addTestCase(uint256 _input, uint256 _output) external;

    function getTestCases() external view returns (TestCase[] memory);

    function setWinnerShare(uint256 _winnerShare) external;
}
