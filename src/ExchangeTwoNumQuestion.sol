// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.6;

import "./Question.sol";
import "./Answer.sol";

abstract contract ExchangeTwoNumAnswer is Answer {
    function main(uint256[] memory input)
        public
        pure
        virtual
        returns (uint256[] memory);
}

contract ExchangeTwoNumQuestion is Question {
    struct TestCase {
        uint256[] input;
        uint256[] output;
    }

    TestCase[] internal testCases;

    string _title = "Exchange two numbers";
    string _description = "Exchange two numbers of an array and return it";
    uint256 _winnerShare = 80;

    constructor() Question(_title, _description, _winnerShare) {
        testCaseCount = 0;
    }

    function addTestCase(uint256[] memory input, uint256[] memory output)
        public
    {
        TestCase memory testCase = TestCase(input, output);
        testCases.push(testCase);
        testCaseCount++;
    }

    function setTestCase(
        uint256 testCaseId,
        uint256[] memory input,
        uint256[] memory output
    ) public {
        TestCase memory testCase = TestCase(input, output);

        testCases[testCaseId] = testCase;
    }

    function getTestCases() public view returns (TestCase[] memory) {
        return testCases;
    }

    function getTestCasesById(uint256 testCaseId)
        public
        view
        returns (uint256[] memory input, uint256[] memory output)
    {
        return (testCases[testCaseId].input, testCases[testCaseId].output);
    }

    function verify(address answerAddr, uint256 testCaseId)
        public
        view
        override
        returns (bool)
    {
        uint256[] memory actual = ExchangeTwoNumAnswer(answerAddr).main(
            testCases[testCaseId].input
        );
        uint256[] memory expected = testCases[testCaseId].output;

        if (actual[0] != expected[0] || actual[1] != expected[1]) {
            return false;
        } else {
            return true;
        }
    }
}
