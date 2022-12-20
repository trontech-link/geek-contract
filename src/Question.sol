// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.6;

contract Question {
    struct TestCase {
        uint256[] input;
        uint256 output;
    }

    address payable public owner;
    string public description;
    mapping(uint256 => address) prizePool;
    mapping(uint256 => address) winner;
    TestCase[] public testCases;

    constructor() {
        owner = payable(msg.sender);
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    function setDescription(string memory _description)
        public
        payable
        onlyOwner
    {
        description = _description;
    }

    function addTestCase(uint256[] memory _input, uint256 _output)
        public
        onlyOwner
    {
        TestCase memory testCase = TestCase(_input, _output);
        testCases.push(testCase);
    }
}
