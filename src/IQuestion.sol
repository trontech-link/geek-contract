// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.6;

import "./TestCase.sol";

interface IQuestion {
    function addTestCase(uint256[] memory _input, uint256[] memory _output)
        external;

    function getTestCases() external view returns (TestCase[] memory);

    function setWinnerShare(uint256 _winnerShare) external;
}
