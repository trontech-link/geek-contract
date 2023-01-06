// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.6;

import "./Question.sol";

interface Answer {
    function main(uint256[] memory _input) external returns (uint256[] memory _output);
}

contract Exchange2NumsQuestion is Question("Exchange 2 nums", "exchange 2 num", 80, "uint256[]", "uint256[]") {
    struct TestCase {
        uint256[] input;
        uint256[] output;
    }

    TestCase[] testCases;

    function addTestCase(uint256[] memory _input, uint256[] memory _output) public onlyOwner {
        TestCase memory tc = TestCase(_input, _output);
        testCases.push(tc);
        testCaseCount++;
    }

    function setTestCase(uint256 testCaseId, uint256[] memory _input, uint256[] memory _output) public onlyOwner {
        TestCase memory testCase = TestCase(_input, _output);
        testCases[testCaseId] = testCase;
    }

    function verify(address answerAddr) public override returns (bool isPassed, uint256 testCaseId){
        uint256 arrLength = testCases.length;
        require(arrLength > 0, "No test cases available for this question.");

        for (uint256 i = 0; i < arrLength; i++) {
            uint256[] memory expected = testCases[i].output;
            uint256[] memory actual = Answer(answerAddr).main(testCases[i].input);

            if (keccak256(abi.encode(expected)) != keccak256(abi.encode(actual))) {
                return (false, i);
            }
        }

        return (true, 0);
    }

    function getTestCasesById(uint256 testCaseId) public view override returns (bytes memory){
        TestCase memory tc = testCases[testCaseId];
        return abi.encode(tc);
    }

}
