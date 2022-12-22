// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.6;

import "./IQuestion.sol";

contract Question is IQuestion {
    address payable public owner;
    string public description;
    uint256 public winnerShare; // in percent
    TestCase[] public testCases;

    constructor() {
        owner = payable(msg.sender);
        winnerShare = 80; // Winner share is 80% by default
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not Owner");
        _;
    }

    function setDescription(string memory _description) public onlyOwner {
        description = _description;
    }

    function addTestCase(
        uint256 numOfInput,
        string[] memory input,
        string memory output
    ) public override onlyOwner {
        bytes[] memory inputBytes = new bytes[](numOfInput);
        uint256 arrLength = input.length;
        for (uint256 i = 0; i < arrLength; i++) {
            inputBytes[i] = bytes(input[i]);
        }
        bytes memory outputBytes = bytes(output);
        TestCase memory testCase = TestCase(inputBytes, outputBytes);

        testCases.push(testCase);
    }

    function getTestCases() public view override returns (TestCase[] memory) {
        return testCases;
    }

    function setWinnerShare(uint256 _winnerShare) public override {
        winnerShare = _winnerShare;
    }
}
