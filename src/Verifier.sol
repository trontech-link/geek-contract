// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.6;

contract Verifier {
    struct TestCase {
        uint256 input;
        uint256 output;
    }

    address payable public owner;
    address[] public registeredQuestionList;
    mapping(uint256 => address) public prizePool;
    mapping(uint256 => address) public winner;

    event TestFailed(
        uint256 testCaseId,
        TestCase testCase,
        uint256 expected,
        uint256 actual
    );
    event TestPassed(
        uint256 testCaseId,
        TestCase testCase,
        uint256 expected,
        uint256 actual
    );

    constructor() {
        owner = payable(msg.sender);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    function _getTestCase(uint256 _questionId)
        private
        returns (TestCase[] memory)
    {
        // Get contract address of the question that need to be verified
        address questionAddr = registeredQuestionList[_questionId];

        (bool testCaseSuccess, bytes memory descriptionData) = questionAddr
            .call(abi.encodeWithSignature("getTestCases()"));
        require(testCaseSuccess, "Get test cases failed.");

        TestCase[] memory testCases = abi.decode(descriptionData, (TestCase[]));

        return testCases;
    }

    function verify(uint256 _questionId, address answerAddr)
        public
        payable
        onlyOwner
        returns (bool)
    {
        TestCase[] memory testCases = _getTestCase(_questionId);

        uint256 arrLength = testCases.length;

        for (uint256 i = 0; i < arrLength; i++) {
            bytes memory payload = abi.encodeWithSignature(
                "main(uint256)",
                testCases[i].input
            );

            (bool answerSuccess, bytes memory answerData) = answerAddr.call(
                payload
            );
            require(answerSuccess, "Answer call failed.");
            uint256 expected = testCases[i].output;
            uint256 actual = abi.decode(answerData, (uint256));
            if (expected != actual) {
                emit TestFailed(i, testCases[i], expected, actual);
                return false;
            } else {
                emit TestPassed(i, testCases[i], expected, actual);
            }
        }
        return true;
    }

    function registerQuestion(address questionAddr) public payable {
        registeredQuestionList.push(questionAddr);
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
