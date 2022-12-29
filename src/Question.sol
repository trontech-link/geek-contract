// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.6;

import "./IQuestion.sol";
import "./TestCase.sol";

contract Question is IQuestion {
    address payable public owner;
    string public description;
    uint256 public winnerShare; // in percent
    TestCase[] internal testCases;

    constructor(string memory _description, uint256 _winnerShare) {
        owner = payable(msg.sender);
        description = _description;
        winnerShare = _winnerShare;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not Owner");
        _;
    }

    function setDescription(string memory _description) public onlyOwner {
        description = _description;
    }

    function addTestCase(uint256[] memory input, uint256[] memory output)
        public
        override
        onlyOwner
    {
        uint256 inputNums = input.length;
        bytes[] memory inputBytes = new bytes[](inputNums);
        for (uint256 i = 0; i < inputNums; i++) {
            inputBytes[i] = abi.encode(input[i]);
        }

        uint256 outputNums = output.length;
        bytes[] memory outputBytes = new bytes[](outputNums);
        for (uint256 i = 0; i < outputNums; i++) {
            outputBytes[i] = abi.encode(output[i]);
        }

        TestCase memory testCase = TestCase(inputBytes, outputBytes);

        testCases.push(testCase);
    }

    function setTestCase(
        uint256 testCaseId,
        uint256[] memory input,
        uint256[] memory output
    ) public {
        uint256 inputNums = input.length;
        bytes[] memory inputBytes = new bytes[](inputNums);
        for (uint256 i = 0; i < inputNums; i++) {
            inputBytes[i] = abi.encode(input[i]);
        }

        uint256 outputNums = output.length;
        bytes[] memory outputBytes = new bytes[](outputNums);
        for (uint256 i = 0; i < outputNums; i++) {
            outputBytes[i] = abi.encode(output[i]);
        }

        TestCase memory testCase = TestCase(inputBytes, outputBytes);

        testCases[testCaseId] = testCase;
    }

    function getTestCases() public view override returns (TestCase[] memory) {
        return testCases;
    }

    function setWinnerShare(uint256 _winnerShare) public override {
        winnerShare = _winnerShare;
    }
}
