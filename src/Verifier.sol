// SPDX-License-Identifer: UNLICENSED
pragma solidity ^0.8.6;

import "https://github.com/Arachnid/solidity-stringutils/blob/master/src/strings.sol";

contract Verifier {
    using strings for *;

    struct TestCase {
        bytes32 input;
        bytes32 output;
    }

    address payable public owner;
    mapping(uint256 => address) public registeredQuestionList;
    mapping(uint256 => address) public prizePool;
    mapping(uint256 => address) public winner;
    uint256 questionId;

    constructor() {
        owner = payable(msg.sender);
        questionId = 0;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    function verify(uint256 _questionId, address answerAddr)
        public
        payable
        onlyOwner
        returns (bool)
    {
        // Get contract address of the question that need to be verified
        address questionAddr = registeredQuestionList[_questionId];

        // Get the encodede testCase data
        (, bytes memory testCaseData) = questionAddr.call(
            abi.encodeWithSignature("testCases()")
        );

        // Decode the testCase data to get the test cases
        TestCase[] memory testCases = abi.decode(testCaseData, (TestCase[]));

        uint256 arrLength = testCases.length;

        for (uint256 i = 0; i < arrLength; i++) {
            bytes memory payload = abi.encodeWithSignature(
                "main()",
                _parseTestCaseInput(testCases[i].input)
            );
            (, bytes memory answerData) = answerAddr.call(payload);
            if (testCases[i].output != abi.decode(answerData, (bytes32))) {
                return false;
            }
        }
        return true;
    }

    function _parseTestCaseInput(string _input)
        private
        view
        returns (uint256[])
    {
        strings.slice memory stringSlice = _input.toSlice();
        strings.slice memory delimeterSlice = ",".toSlice();
        string[] memory strings = new string[](
            stringSlice.count(delimeterSlice)
        );
        for (uint256 i = 0; i < strings.length; i++) {
            strings[i] = stringSlice.split(delim).toString();
        }
        return strings;
    }

    function registerQuestion(address questionAddr) public payable {
        registeredQuestionList[questionId] = questionAddr;
        questionId++;
    }

    function rewardWinner(uint256 _questionId, address payable _winnerAddr)
        public
        onlyOwner
    {
        _winnerAddr.transfer(prizePool[_questionId].balance);
    }

    function deposit(uint256 _questionId) public payable {
        payable(prizePool[_questionId]).transfer(msg.value);
    }

    function withdraw(uint256 _questionId, uint256 amount) public onlyOwner {
        require(
            amount <= prizePool[_questionId].balance,
            "Insufficient balance for this prize pool."
        );
        owner.transfer(amount);
    }
}
