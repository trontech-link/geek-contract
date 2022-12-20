// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.6;

contract Verifier {
    struct TestCase {
        uint256 input;
        uint256 output;
    }

    address payable public owner;
    address[] public registeredQuestionList;
    mapping(uint256 => uint256) public prizePool;
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
    event Rewarded(uint256 questionId, address winner);

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

        (bool success, bytes memory data) = questionAddr.call(
            abi.encodeWithSignature("getTestCases()")
        );
        require(success, "Get test cases failed.");

        TestCase[] memory testCases = abi.decode(data, (TestCase[]));

        return testCases;
    }

    function _getAnswerOwner(address answerAddr)
        private
        returns (address payable)
    {
        (bool success, bytes memory data) = answerAddr.call(
            abi.encodeWithSignature("owner()")
        );
        require(success, "Get answer owner failed.");

        return abi.decode(data, (address));
    }

    function _getQuestionOwner(uint256 _questionId)
        private
        returns (address payable)
    {
        address questionAddr = registeredQuestionList[_questionId];

        (bool success, bytes memory data) = questionAddr.call(
            abi.encodeWithSignature("owner()")
        );
        require(success, "Get question owner failed.");

        return abi.decode(data, (address));
    }

    function verify(uint256 _questionId, address answerAddr)
        public
        payable
        returns (bool)
    {
        require(
            prizePool[_questionId] > 0,
            "This question had already been rewarded."
        );
        require(msg.value >= 1, "Must pay at least 1 sun to verify.");
        prizePool[_questionId] += msg.value;
        TestCase[] memory testCases = _getTestCase(_questionId);

        uint256 arrLength = testCases.length;

        for (uint256 i = 0; i < arrLength; i++) {
            bytes memory payload = abi.encodeWithSignature(
                "main(uint256)",
                testCases[i].input
            );

            (bool success, bytes memory data) = answerAddr.call(payload);
            require(success, "Answer call failed.");
            uint256 expected = testCases[i].output;
            uint256 actual = abi.decode(data, (uint256));
            if (expected != actual) {
                emit TestFailed(i, testCases[i], expected, actual);
                return false;
            } else {
                emit TestPassed(i, testCases[i], expected, actual);
            }
        }
        rewardWinner(_questionId, answerAddr);
        return true;
    }

    function registerQuestion(address questionAddr) public payable {
        require(msg.value > 1, "Must pay at least 1 sun to register.");
        uint256 questionId = registeredQuestionList.length;
        prizePool[questionId] = msg.value;
        registeredQuestionList.push(questionAddr);
    }

    function rewardWinner(uint256 _questionId, address answerAddr)
        public
        onlyOwner
    {
        address payable winnerAddr = _getAnswerOwner(answerAddr);
        winner[_questionId] = winnerAddr;
        uint256 rewardToWinner = (prizePool[_questionId] * 4) / 5;
        prizePool[_questionId] -= rewardToWinner;
        winnerAddr.transfer(rewardToWinner);
        address payable questionOwner = _getQuestionOwner(_questionId);
        questionOwner.transfer(prizePool[_questionId]);
        prizePool[_questionId] = 0;
        emit Rewarded(_questionId, winnerAddr);
    }

    function deposit(uint256 _questionId) public payable {
        require(msg.value >= 1, "Must deposit more than 1 sun.");
        prizePool[_questionId] += msg.value;
    }

    function withdraw(uint256 _questionId, uint256 amount) public onlyOwner {
        require(
            amount <= prizePool[_questionId],
            "Insufficient balance for this prize pool."
        );
        owner.transfer(amount);
    }
}
