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

    function setDescription(string memory _description)
        public
        override
        onlyOwner
    {
        description = _description;
    }

    function addTestCase(uint256 _input, uint256 _output)
        public
        override
        onlyOwner
    {
        TestCase memory testCase = TestCase(_input, _output);
        testCases.push(testCase);
    }

    function getTestCases() public view override returns (TestCase[] memory) {
        return testCases;
    }

    function setWinnerShare(uint256 _winnerShare) public override {
        winnerShare = _winnerShare;
    }
}
